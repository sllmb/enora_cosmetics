"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { TAG_CATALOGUE } from "@/features/catalogue/serveur";
import { exigerAdmin } from "@/features/compte/serveur";

export type ResultatAdmin = { ok: true } | { ok: false; message: string };

const MESSAGES: Record<string, string> = {
  TRANSITION_INTERDITE: "Ce changement de statut n'est pas possible depuis le statut actuel.",
  COMMANDE_INTROUVABLE: "Cette commande n'existe plus.",
  ACCES_REFUSE: "Action réservée aux administrateurs.",
};

const statutSchema = z.enum(["confirmee", "expediee", "livree", "annulee"]);

/** RM-09 : transitions contrôlées en base ; une annulation remet le stock. */
export async function changerStatutCommande(
  reference: string,
  statut: string,
): Promise<ResultatAdmin> {
  const { supabase } = await exigerAdmin();
  const nouveau = statutSchema.safeParse(statut);
  if (!nouveau.success) return { ok: false, message: "Statut inconnu." };
  const { error } = await supabase.rpc("changer_statut_commande", {
    p_reference: reference,
    p_statut: nouveau.data,
  });
  if (error) {
    const message = MESSAGES[error.message];
    if (!message) console.error("changer_statut_commande :", error);
    return { ok: false, message: message ?? "Le statut n'a pas pu être modifié." };
  }
  // Stock remis en vente : le catalogue public se met à jour tout de suite.
  if (nouveau.data === "annulee") updateTag(TAG_CATALOGUE);
  return { ok: true };
}

/** RM-12 : paiement Wave / Orange Money vérifié (ou encaissé par le livreur). */
export async function marquerPaiement(reference: string, recu: boolean): Promise<ResultatAdmin> {
  const { supabase } = await exigerAdmin();
  const { error } = await supabase
    .from("commandes")
    .update({ paiement_recu_le: recu ? new Date().toISOString() : null })
    .eq("reference", reference);
  if (error) {
    console.error("marquerPaiement :", error);
    return { ok: false, message: "Le paiement n'a pas pu être enregistré." };
  }
  return { ok: true };
}
