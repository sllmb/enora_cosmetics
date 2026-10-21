import "server-only";
import { notFound } from "next/navigation";
import { supabaseEstConfiguree } from "@/shared/config/env";
import { creerClientServeur } from "@/shared/supabase/serveur";

/**
 * RM-01 : à appeler en tête de chaque page et de chaque action de
 * l'administration. Une Server Action peut être appelée directement, sans
 * passer par la page : la vérification du proxy ne suffit pas.
 * Renvoie le client Supabase de la session (soumis à la RLS administrateur).
 */
export async function exigerAdmin() {
  if (!supabaseEstConfiguree()) notFound();
  const supabase = await creerClientServeur();
  const [{ data: utilisateur }, { data: estAdmin }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("est_admin"),
  ]);
  // 404 plutôt que 403 : on ne confirme pas l'existence de l'administration.
  if (!utilisateur.user || estAdmin !== true) notFound();
  return { supabase, email: utilisateur.user.email ?? "" };
}
