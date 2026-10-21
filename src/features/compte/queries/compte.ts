import "server-only";
import { supabaseEstConfiguree } from "@/shared/config/env";
import { creerClientServeur } from "@/shared/supabase/serveur";
import type { Utilisatrice } from "../types";

/**
 * Utilisatrice connectée (vérifiée auprès de Supabase) et son profil, ou null.
 * Lit les cookies : à appeler sous <Suspense>.
 */
export async function lireUtilisatrice(): Promise<Utilisatrice | null> {
  if (!supabaseEstConfiguree()) return null;
  const supabase = await creerClientServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profil } = await supabase
    .from("profils")
    .select("nom, telephone, adresse, zone_livraison_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return {
    id: user.id,
    email: user.email ?? "",
    nom: profil?.nom ?? "",
    telephone: profil?.telephone ?? "",
    adresse: profil?.adresse ?? "",
    zoneId: profil?.zone_livraison_id ?? null,
  };
}
