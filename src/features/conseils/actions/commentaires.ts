"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { exigerAdmin } from "@/features/compte/serveur";
import { nomPublic } from "@/shared/lib/format";
import { creerClientServeur } from "@/shared/supabase/serveur";
import { TAG_COMMENTAIRES } from "../queries/commentaires";
import { commentaireSchema } from "../schemas/commentaire";
import type { ResultatCommentaire } from "../types";

const idSchema = z.coerce.number().int().positive();

/** RM-14 : cliente connectée, article publié, publication après validation. */
export async function deposerCommentaire(
  articleId: number,
  donnees: unknown,
): Promise<ResultatCommentaire> {
  const saisie = commentaireSchema.safeParse(donnees);
  if (!saisie.success) {
    return { ok: false, message: saisie.error.issues[0]?.message ?? "Commentaire invalide." };
  }
  if (!idSchema.safeParse(articleId).success) return { ok: false, message: "Article inconnu." };

  const supabase = await creerClientServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Connectez-vous pour commenter." };

  const { data: profil } = await supabase
    .from("profils")
    .select("nom")
    .eq("user_id", user.id)
    .maybeSingle();

  // La RLS vérifie l'article publié, le statut « en_attente » et la limite de 5 en attente.
  const { error } = await supabase.from("commentaires_articles").insert({
    article_id: articleId,
    user_id: user.id,
    auteur: nomPublic(profil?.nom ?? ""),
    contenu: saisie.data.contenu,
    statut: "en_attente",
  });
  if (error?.code === "42501") {
    return {
      ok: false,
      message:
        "Vous avez déjà plusieurs commentaires en attente de validation. Merci de patienter.",
    };
  }
  if (error) {
    console.error("deposerCommentaire :", error);
    return { ok: false, message: "Votre commentaire n'a pas pu être envoyé. Réessayez." };
  }
  return { ok: true, message: "Merci ! Votre commentaire sera publié après validation." };
}

export async function modererCommentaire(
  id: number,
  statut: "publie" | "refuse",
): Promise<ResultatCommentaire> {
  const { supabase } = await exigerAdmin();
  if (!idSchema.safeParse(id).success || !["publie", "refuse"].includes(statut)) {
    return { ok: false, message: "Action invalide." };
  }
  const { error } = await supabase.from("commentaires_articles").update({ statut }).eq("id", id);
  if (error) {
    console.error("modererCommentaire :", error);
    return { ok: false, message: "Le commentaire n'a pas pu être modifié." };
  }
  updateTag(TAG_COMMENTAIRES);
  return {
    ok: true,
    message: statut === "publie" ? "Commentaire publié." : "Commentaire refusé.",
  };
}

export async function supprimerCommentaire(id: number): Promise<ResultatCommentaire> {
  const { supabase } = await exigerAdmin();
  if (!idSchema.safeParse(id).success) return { ok: false, message: "Action invalide." };
  const { error } = await supabase.from("commentaires_articles").delete().eq("id", id);
  if (error) return { ok: false, message: "Le commentaire n'a pas pu être supprimé." };
  updateTag(TAG_COMMENTAIRES);
  return { ok: true, message: "Commentaire supprimé." };
}
