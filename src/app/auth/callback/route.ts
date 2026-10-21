import { NextResponse, type NextRequest } from "next/server";
import { cheminDeRetour } from "@/shared/lib/redirection";
import { creerClientServeur } from "@/shared/supabase/serveur";

/**
 * Retour des liens envoyés par email (confirmation d'inscription, mot de passe
 * oublié) : échange le code contre une session, puis renvoie vers ?suite=.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const suite = cheminDeRetour(searchParams.get("suite"));

  if (code) {
    const supabase = await creerClientServeur();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(suite, origin));
  }
  return NextResponse.redirect(new URL("/compte/connexion?erreur=lien", origin));
}
