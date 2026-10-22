"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { exigerAdmin } from "@/features/compte/serveur";
import { creerClientServeur } from "@/shared/supabase/serveur";
import { nomPublic } from "../lib/avis";
import { TAG_AVIS } from "../queries/avis";
import { avisSchema } from "../schemas/avis";
import type { ResultatAvis } from "../types";

const idSchema = z.coerce.number().int().positive();

/** RM-10 / RM-11 : dépôt par une cliente qui a reçu le produit, en attente de modération. */
export async function deposerAvis(produitId: number, donnees: unknown): Promise<ResultatAvis> {
  const saisie = avisSchema.safeParse(donnees);
  if (!saisie.success || !idSchema.safeParse(produitId).success) {
    return { ok: false, message: saisie.error?.issues[0]?.message ?? "Avis invalide." };
  }
  const supabase = await creerClientServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Connectez-vous pour donner votre avis." };

  const { data: profil } = await supabase
    .from("profils")
    .select("nom")
    .eq("user_id", user.id)
    .maybeSingle();

  // La RLS (avis_depot) vérifie la commande livrée et impose le statut « en_attente ».
  const { error } = await supabase.from("avis").insert({
    produit_id: produitId,
    user_id: user.id,
    auteur: nomPublic(profil?.nom ?? ""),
    note: saisie.data.note,
    commentaire: saisie.data.commentaire,
    statut: "en_attente",
  });
  if (error?.code === "23505") {
    return { ok: false, message: "Vous avez déjà donné votre avis sur ce produit." };
  }
  if (error?.code === "42501") {
    return {
      ok: false,
      message: "Vous pourrez donner votre avis une fois ce produit reçu.",
    };
  }
  if (error) {
    console.error("deposerAvis :", error);
    return { ok: false, message: "Votre avis n'a pas pu être envoyé. Réessayez." };
  }
  return {
    ok: true,
    message: "Merci ! Votre avis sera publié après une rapide vérification.",
  };
}

/** RM-11 : publication ou refus par l'administration. */
export async function modererAvis(id: number, statut: "publie" | "refuse"): Promise<ResultatAvis> {
  const { supabase } = await exigerAdmin();
  if (!idSchema.safeParse(id).success || !["publie", "refuse"].includes(statut)) {
    return { ok: false, message: "Action invalide." };
  }
  const { error } = await supabase.from("avis").update({ statut }).eq("id", id);
  if (error) {
    console.error("modererAvis :", error);
    return { ok: false, message: "L'avis n'a pas pu être modifié." };
  }
  updateTag(TAG_AVIS);
  return { ok: true, message: statut === "publie" ? "Avis publié." : "Avis refusé." };
}

export async function supprimerAvis(id: number): Promise<ResultatAvis> {
  const { supabase } = await exigerAdmin();
  const { error } = await supabase.from("avis").delete().eq("id", id);
  if (error) return { ok: false, message: "L'avis n'a pas pu être supprimé." };
  updateTag(TAG_AVIS);
  return { ok: true, message: "Avis supprimé." };
}
