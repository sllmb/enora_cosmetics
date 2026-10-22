import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { lireEnvSupabase, supabaseEstConfiguree } from "@/shared/config/env";

/*
 * Avant chaque page : rafraîchit la session Supabase (cookies), renvoie vers
 * la connexion quand une page du compte ou de l'administration est ouverte sans
 * être connecté·e, et écarte de /admin les comptes non administrateurs.
 * Simple confort : chaque page, chaque action et la RLS revérifient.
 */

const COMPTE_PUBLIC = ["/compte/connexion", "/compte/inscription", "/compte/mot-de-passe-oublie"];

export async function proxy(request: NextRequest) {
  let reponse = NextResponse.next({ request });
  if (!supabaseEstConfiguree()) return reponse;

  const { url, cleAnon } = lireEnvSupabase();
  const supabase = createServerClient(url, cleAnon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (aPoser) => {
        aPoser.forEach(({ name, value }) => request.cookies.set(name, value));
        reponse = NextResponse.next({ request });
        aPoser.forEach(({ name, value, options }) => reponse.cookies.set(name, value, options));
      },
    },
  });

  // Vérifie (et renouvelle si besoin) le jeton de session.
  const { data } = await supabase.auth.getClaims();
  const connecte = Boolean(data?.claims);

  const { pathname, search } = request.nextUrl;
  const sousChemin = (racine: string) => pathname === racine || pathname.startsWith(`${racine}/`);
  const pageProtegee =
    sousChemin("/admin") || (sousChemin("/compte") && !COMPTE_PUBLIC.includes(pathname));
  if (pageProtegee && !connecte) {
    const connexion = new URL("/compte/connexion", request.url);
    connexion.searchParams.set("suite", `${pathname}${search}`);
    return NextResponse.redirect(connexion);
  }

  // RM-01 : /admin réservé aux comptes de la table admins (lisible pour sa propre ligne).
  if (sousChemin("/admin")) {
    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", String(data?.claims?.sub))
      .maybeSingle();
    if (!admin) return NextResponse.redirect(new URL("/", request.url));
  }
  return reponse;
}

export const config = {
  // Ni fichiers statiques, ni images, ni icônes.
  matcher: [
    "/((?!_next/static|_next/image|brand/|icon.png|apple-icon.png|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
