import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { supabaseEstConfiguree } from "@/shared/config/env";
import { creerClientPublic } from "@/shared/supabase/public";
import { creerClientServeur } from "@/shared/supabase/serveur";
import { creerClientService } from "@/shared/supabase/service";
import type { CommandeConfirmee, ZoneLivraison } from "../types";

export const TAG_LIVRAISON = "livraison";

// Identiques à supabase/seed.sql, utilisées sans clés Supabase (CI, démo).
const ZONES_DEMO: ZoneLivraison[] = [
  { id: 1, nom: "Dakar (centre et Plateau)", frais: 1500, delai: "24 h" },
  { id: 2, nom: "Dakar banlieue (Pikine, Guédiawaye, Rufisque)", frais: 2500, delai: "24 à 48 h" },
  { id: 3, nom: "Thiès, Mbour, Saly", frais: 3500, delai: "2 à 3 jours" },
];

const zoneSchema = z.object({
  id: z.number(),
  nom: z.string(),
  frais: z.number().int(),
  delai: z.string(),
});

export async function listerZones(): Promise<ZoneLivraison[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_LIVRAISON);
  if (!supabaseEstConfiguree()) return ZONES_DEMO;
  const { data, error } = await creerClientPublic()
    .from("zones_livraison")
    .select("id, nom, frais, delai")
    .eq("active", true)
    .order("ordre");
  if (error) throw new Error(`Lecture des zones de livraison : ${error.message}`);
  return z.array(zoneSchema).parse(data);
}

const commandeSchema = z.object({
  reference: z.string(),
  nom: z.string(),
  telephone: z.string(),
  adresse: z.string(),
  zone_nom: z.string(),
  mode_paiement: z.enum(["livraison", "wave", "orange_money", "whatsapp"]),
  statut: z.enum(["en_attente", "confirmee", "expediee", "livree", "annulee"]),
  sous_total: z.number(),
  frais_livraison: z.number(),
  total: z.number(),
  created_at: z.string(),
  commande_lignes: z.array(
    z.object({
      nom_produit: z.string(),
      prix_unitaire: z.number(),
      quantite: z.number(),
      total_ligne: z.number(),
    }),
  ),
});

const COLONNES_COMMANDE = `reference, nom, telephone, adresse, zone_nom, mode_paiement, statut,
  sous_total, frais_livraison, total, created_at,
  commande_lignes(nom_produit, prix_unitaire, quantite, total_ligne)`;

function versCommande(donnees: unknown): CommandeConfirmee {
  const c = commandeSchema.parse(donnees);
  return {
    reference: c.reference,
    nom: c.nom,
    telephone: c.telephone,
    adresse: c.adresse,
    zoneNom: c.zone_nom,
    modePaiement: c.mode_paiement,
    statut: c.statut,
    sousTotal: c.sous_total,
    fraisLivraison: c.frais_livraison,
    total: c.total,
    creeLe: c.created_at,
    lignes: c.commande_lignes.map((l) => ({
      nom: l.nom_produit,
      prixUnitaire: l.prix_unitaire,
      quantite: l.quantite,
      total: l.total_ligne,
    })),
  };
}

/**
 * Commande affichée sur la page de confirmation. La référence seule ne suffit
 * pas (elle se devine) : il faut aussi la clé secrète reçue à la création.
 */
export async function lireCommandeConfirmee(
  reference: string,
  cle: string,
): Promise<CommandeConfirmee | null> {
  if (!supabaseEstConfiguree() || !z.uuid().safeParse(cle).success) return null;
  const { data, error } = await creerClientService()
    .from("commandes")
    .select(COLONNES_COMMANDE)
    .eq("reference", reference)
    .eq("cle_suivi", cle)
    .maybeSingle();
  if (error) throw new Error(`Lecture de la commande : ${error.message}`);
  return data ? versCommande(data) : null;
}

/*
 * Commandes de l'utilisatrice connectée : client de session, la RLS
 * (user_id = auth.uid()) ne renvoie que les siennes. À appeler sous <Suspense>.
 */

export async function listerCommandesUtilisatrice(): Promise<CommandeConfirmee[]> {
  if (!supabaseEstConfiguree()) return [];
  const { data, error } = await (
    await creerClientServeur()
  )
    .from("commandes")
    .select(COLONNES_COMMANDE)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(`Lecture des commandes : ${error.message}`);
  return data.map(versCommande);
}

export async function lireCommandeUtilisatrice(
  reference: string,
): Promise<CommandeConfirmee | null> {
  if (!supabaseEstConfiguree()) return null;
  const { data, error } = await (
    await creerClientServeur()
  )
    .from("commandes")
    .select(COLONNES_COMMANDE)
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw new Error(`Lecture de la commande : ${error.message}`);
  return data ? versCommande(data) : null;
}
