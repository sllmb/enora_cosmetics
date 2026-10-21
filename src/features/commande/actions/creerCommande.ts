"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { TAG_CATALOGUE } from "@/features/catalogue/serveur";
import { supabaseEstConfiguree } from "@/shared/config/env";
import { creerClientServeur } from "@/shared/supabase/serveur";
import { creerClientService } from "@/shared/supabase/service";
import { traduireErreurCommande } from "../lib/erreurs";
import { coordonneesSchema, lignesCommandeSchema } from "../schemas/commande";
import type { ResultatCommande } from "../types";

const retourSchema = z.object({ o_reference: z.string(), o_cle_suivi: z.uuid() });

/**
 * RM-08 : le navigateur n'envoie que des coordonnées et des quantités. Prix,
 * promotions, frais de livraison, stock et total sont relus et calculés en
 * base par creer_commande, dans une seule transaction.
 */
export async function creerCommande(
  coordonnees: unknown,
  lignes: unknown,
): Promise<ResultatCommande> {
  const saisie = coordonneesSchema.safeParse(coordonnees);
  if (!saisie.success) {
    return {
      ok: false,
      message: "Certains champs sont à corriger.",
      erreurs: Object.fromEntries(
        saisie.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
      ),
    };
  }
  const panier = lignesCommandeSchema.safeParse(lignes);
  if (!panier.success) return { ok: false, message: "Votre panier est vide ou invalide." };

  // Champ invisible rempli : envoi automatique, on n'enregistre rien.
  if (saisie.data.siteWeb) return { ok: false, message: "La commande n'a pas pu être envoyée." };

  if (!supabaseEstConfiguree()) {
    return { ok: false, message: "La commande en ligne n'est pas encore ouverte." };
  }

  const { nom, telephone, email, adresse, note, zoneId, modePaiement } = saisie.data;
  // Cliente connectée : la commande apparaîtra dans « Mes commandes ».
  const {
    data: { user },
  } = await (await creerClientServeur()).auth.getUser();
  const { data, error } = await creerClientService()
    .rpc("creer_commande", {
      p_client: { nom, telephone, email: email ?? "", adresse, note: note ?? "" },
      p_zone_id: zoneId,
      p_mode: modePaiement,
      p_lignes: panier.data,
      p_user_id: user?.id ?? null,
    })
    .single();
  if (error) {
    // Erreurs métier attendues (stock…) ou panne : jamais de détail technique côté cliente.
    if (!error.message.match(/^[A-Z_]+(:|$)/)) console.error("creer_commande :", error);
    return traduireErreurCommande(error.message);
  }

  // Le stock a changé : les pages du catalogue se mettent à jour en arrière-plan.
  revalidateTag(TAG_CATALOGUE, "max");
  const commande = retourSchema.parse(data);
  return { ok: true, reference: commande.o_reference, cle: commande.o_cle_suivi };
}
