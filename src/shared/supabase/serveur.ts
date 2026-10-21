import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { lireEnvSupabase } from "@/shared/config/env";

/**
 * Client lié à la session de l'utilisateur (cookies) : Server Components,
 * Server Actions, Route Handlers. Soumis à la RLS.
 */
export async function creerClientServeur() {
  const { url, cleAnon } = lireEnvSupabase();
  const magasin = await cookies();
  return createServerClient(url, cleAnon, {
    cookies: {
      getAll: () => magasin.getAll(),
      setAll: (aPoser) => {
        try {
          aPoser.forEach(({ name, value, options }) => magasin.set(name, value, options));
        } catch {
          // Appel depuis un Server Component : écriture impossible, le proxy rafraîchit la session.
        }
      },
    },
  });
}
