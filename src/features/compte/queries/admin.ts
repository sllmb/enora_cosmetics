import "server-only";
import { notFound } from "next/navigation";
import { cache } from "react";
import { supabaseEstConfiguree } from "@/shared/config/env";
import { creerClientServeur } from "@/shared/supabase/serveur";

/**
 * RM-01 : à appeler en tête de chaque page et de chaque action de
 * l'administration. Une Server Action peut être appelée directement, sans
 * passer par la page : la vérification du proxy ne suffit pas.
 * Renvoie le client Supabase de la session (soumis à la RLS administrateur).
 *
 * Une seule vérification par requête (cache) même si la mise en page, la page
 * et chaque lecture l'appellent. Le jeton est vérifié localement (getClaims,
 * signature ES256) et est_admin() le revalide côté base : pas d'appel réseau
 * supplémentaire à l'authentification.
 */
export const exigerAdmin = cache(async () => {
  if (!supabaseEstConfiguree()) notFound();
  const supabase = await creerClientServeur();
  const [{ data: session }, { data: estAdmin }] = await Promise.all([
    supabase.auth.getClaims(),
    supabase.rpc("est_admin"),
  ]);
  // 404 plutôt que 403 : on ne confirme pas l'existence de l'administration.
  if (!session?.claims || estAdmin !== true) notFound();
  return { supabase, email: String(session.claims.email ?? "") };
});
