"use server";

import { createHmac } from "node:crypto";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { TAG_CATALOGUE } from "@/features/catalogue/serveur";
import { lireEnvServeur, supabaseEstConfiguree } from "@/shared/config/env";
import { creerClientServeur } from "@/shared/supabase/serveur";
import { creerClientService } from "@/shared/supabase/service";
import { traduireErreurCommande } from "../lib/erreurs";
import { adresseVisiteuse, motifLimite } from "../lib/limites";
import { coordonneesSchema, lignesCommandeSchema } from "../schemas/commande";
import type { ResultatCommande } from "../types";

const retourSchema = z.object({ o_reference: z.string(), o_cle_suivi: z.uuid() });

type ClientService = ReturnType<typeof creerClientService>;

/** Empreinte non réversible de l'adresse IP (HMAC avec une clé secrète du serveur). */
function empreinteConnexion(ip: string | null): string | null {
  if (!ip) return null;
  return createHmac("sha256", lireEnvServeur().cleServiceRole).update(ip).digest("hex");
}

/**
 * RM-15 : commandes en attente pour ce numéro (24 h) et depuis cette connexion
 * (1 h). En cas de panne de ce contrôle, la commande passe : une cliente ne doit
 * jamais être bloquée à tort.
 */
async function controlerLimites(
  service: ClientService,
  telephone: string,
  empreinte: string | null,
): Promise<string | null> {
  const depuis = (heures: number) => new Date(Date.now() - heures * 3_600_000).toISOString();
  const [parTelephone, parConnexion] = await Promise.all([
    service
      .from("commandes")
      .select("id", { count: "exact", head: true })
      .eq("telephone", telephone)
      .eq("statut", "en_attente")
      .gte("created_at", depuis(24)),
    empreinte
      ? service
          .from("commandes")
          .select("id", { count: "exact", head: true })
          .eq("ip_empreinte", empreinte)
          .gte("created_at", depuis(1))
      : Promise.resolve({ count: 0, error: null }),
  ]);
  if (parTelephone.error || parConnexion.error) {
    console.error("Limites de commande :", parTelephone.error ?? parConnexion.error);
  }
  return motifLimite({
    enAttenteTelephone: parTelephone.count ?? 0,
    recentesConnexion: parConnexion.count ?? 0,
  });
}

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
  const service = creerClientService();
  const empreinte = empreinteConnexion(adresseVisiteuse(await headers()));
  const motif = await controlerLimites(service, telephone, empreinte);
  if (motif) return { ok: false, message: motif };

  // Cliente connectée : la commande apparaîtra dans « Mes commandes ».
  const {
    data: { user },
  } = await (await creerClientServeur()).auth.getUser();
  const { data, error } = await service
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
  if (empreinte) {
    const { error: erreurEmpreinte } = await service
      .from("commandes")
      .update({ ip_empreinte: empreinte })
      .eq("reference", commande.o_reference);
    if (erreurEmpreinte) console.error("Empreinte de connexion :", erreurEmpreinte);
  }
  return { ok: true, reference: commande.o_reference, cle: commande.o_cle_suivi };
}
