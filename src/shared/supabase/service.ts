import "server-only";
import { createClient } from "@supabase/supabase-js";
import { lireEnvServeur, lireEnvSupabase } from "@/shared/config/env";

/**
 * Client service_role : CONTOURNE la RLS. Réservé aux Server Actions qui ont
 * déjà vérifié les règles métier (ex. création de commande avec prix relus en base).
 * Ne jamais l'utiliser pour lire des données au nom d'un utilisateur.
 */
export function creerClientService() {
  const { url } = lireEnvSupabase();
  const { cleServiceRole } = lireEnvServeur();
  return createClient(url, cleServiceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
