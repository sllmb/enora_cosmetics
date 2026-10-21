import "server-only";
import { createClient } from "@supabase/supabase-js";
import { lireEnvSupabase } from "@/shared/config/env";

/**
 * Client sans session (clé publique, soumis à la RLS) pour les lectures
 * publiques mises en cache ("use cache") : il ne lit pas les cookies, donc le
 * résultat est le même pour tous les visiteurs.
 */
export function creerClientPublic() {
  const { url, cleAnon } = lireEnvSupabase();
  return createClient(url, cleAnon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** URL publique d'un fichier du Storage (bucket public). */
export function urlPublique(bucket: string, chemin: string): string {
  const { url } = lireEnvSupabase();
  return `${url}/storage/v1/object/public/${bucket}/${chemin.replace(/^\/+/, "")}`;
}
