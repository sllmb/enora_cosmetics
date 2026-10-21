import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { lireEnvSupabase, supabaseEstConfiguree } from "@/shared/config/env";

/*
 * Avant chaque page : rafraîchit la session Supabase (cookies) et renvoie vers
 * la connexion quand une page du compte est ouverte sans être connecté·e.
 * Simple confort : chaque page et la RLS revérifient l'utilisateur.
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
  const pageCompte = pathname === "/compte" || pathname.startsWith("/compte/");
  if (pageCompte && !connecte && !COMPTE_PUBLIC.includes(pathname)) {
    const connexion = new URL("/compte/connexion", request.url);
    connexion.searchParams.set("suite", `${pathname}${search}`);
    return NextResponse.redirect(connexion);
  }
  return reponse;
}

export const config = {
  // Ni fichiers statiques, ni images, ni icônes.
  matcher: [
    "/((?!_next/static|_next/image|brand/|icon.png|apple-icon.png|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
