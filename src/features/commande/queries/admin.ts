import "server-only";
import { z } from "zod";
import { exigerAdmin } from "@/features/compte/serveur";
import type { ModePaiement } from "../schemas/commande";
import type { CommandeAdmin, StatutCommande } from "../types";

/*
 * Lectures de l'administration : client de la session administratrice, la RLS
 * (est_admin()) donne accès à toutes les commandes. Jamais mises en cache.
 */

const STATUTS = ["en_attente", "confirmee", "expediee", "livree", "annulee"] as const;
const MODES = ["livraison", "wave", "orange_money", "whatsapp"] as const;

const ligneSchema = z.object({
  reference: z.string(),
  nom: z.string(),
  telephone: z.string(),
  email: z.string().nullable(),
  adresse: z.string(),
  note: z.string().nullable(),
  zone_nom: z.string(),
  mode_paiement: z.enum(MODES),
  statut: z.enum(STATUTS),
  sous_total: z.number(),
  frais_livraison: z.number(),
  total: z.number(),
  created_at: z.string(),
  paiement_recu_le: z.string().nullable(),
  user_id: z.string().nullable(),
  commande_lignes: z.array(
    z.object({
      nom_produit: z.string(),
      prix_unitaire: z.number(),
      quantite: z.number(),
      total_ligne: z.number(),
    }),
  ),
});

const COLONNES = `reference, nom, telephone, email, adresse, note, zone_nom, mode_paiement,
  statut, sous_total, frais_livraison, total, created_at, paiement_recu_le, user_id,
  commande_lignes(nom_produit, prix_unitaire, quantite, total_ligne)`;

function versCommandeAdmin(donnees: unknown): CommandeAdmin {
  const c = ligneSchema.parse(donnees);
  return {
    reference: c.reference,
    nom: c.nom,
    telephone: c.telephone,
    email: c.email,
    adresse: c.adresse,
    note: c.note,
    zoneNom: c.zone_nom,
    modePaiement: c.mode_paiement as ModePaiement,
    statut: c.statut,
    sousTotal: c.sous_total,
    fraisLivraison: c.frais_livraison,
    total: c.total,
    creeLe: c.created_at,
    paiementRecuLe: c.paiement_recu_le,
    avecCompte: c.user_id !== null,
    lignes: c.commande_lignes.map((l) => ({
      nom: l.nom_produit,
      prixUnitaire: l.prix_unitaire,
      quantite: l.quantite,
      total: l.total_ligne,
    })),
  };
}

export type FiltreCommandes = { statut?: StatutCommande; recherche?: string };

export function lireFiltreCommandes(params: Record<string, string | string[] | undefined>) {
  const statut = typeof params.statut === "string" ? params.statut : undefined;
  const recherche = typeof params.q === "string" ? params.q.trim() : undefined;
  return {
    statut: STATUTS.includes(statut as StatutCommande) ? (statut as StatutCommande) : undefined,
    recherche: recherche || undefined,
  };
}

export async function listerCommandesAdmin(filtre: FiltreCommandes = {}): Promise<CommandeAdmin[]> {
  const { supabase } = await exigerAdmin();
  let requete = supabase
    .from("commandes")
    .select(COLONNES)
    .order("created_at", { ascending: false })
    .limit(100);
  if (filtre.statut) requete = requete.eq("statut", filtre.statut);
  if (filtre.recherche) {
    // Caractères réservés de la syntaxe de filtre retirés de la saisie.
    const q = filtre.recherche.replace(/[,()*%\\]/g, " ").trim();
    if (q) requete = requete.or(`reference.ilike.%${q}%,nom.ilike.%${q}%,telephone.ilike.%${q}%`);
  }
  const { data, error } = await requete;
  if (error) throw new Error(`Lecture des commandes : ${error.message}`);
  return data.map(versCommandeAdmin);
}

export async function lireCommandeAdmin(reference: string): Promise<CommandeAdmin | null> {
  const { supabase } = await exigerAdmin();
  const { data, error } = await supabase
    .from("commandes")
    .select(COLONNES)
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw new Error(`Lecture de la commande : ${error.message}`);
  return data ? versCommandeAdmin(data) : null;
}

export type Statistiques = {
  aTraiter: number;
  aujourdhui: number;
  paiementsAVerifier: number;
  chiffreDuMois: number;
  commandesDuMois: number;
};

/** Nombre de commandes en attente (pastille du menu d'administration). */
export async function compterCommandesEnAttente(): Promise<number> {
  const { supabase } = await exigerAdmin();
  const { count, error } = await supabase
    .from("commandes")
    .select("id", { count: "exact", head: true })
    .eq("statut", "en_attente");
  if (error) throw new Error(`Lecture des commandes en attente : ${error.message}`);
  return count ?? 0;
}

/** Chiffres du tableau de bord (fuseau de Dakar = UTC, pas d'heure d'été). */
export async function lireStatistiques(): Promise<Statistiques> {
  const { supabase } = await exigerAdmin();
  const maintenant = new Date();
  const debutJour = new Date(
    Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), maintenant.getUTCDate()),
  ).toISOString();
  const debutMois = new Date(
    Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), 1),
  ).toISOString();

  const compter = (requete: PromiseLike<{ count: number | null; error: unknown }>) =>
    Promise.resolve(requete).then(({ count, error }) => {
      if (error) throw new Error("Lecture des statistiques impossible.");
      return count ?? 0;
    });
  const base = () => supabase.from("commandes").select("id", { count: "exact", head: true });

  const [aTraiter, aujourdhui, paiementsAVerifier, mois] = await Promise.all([
    compter(base().eq("statut", "en_attente")),
    compter(base().gte("created_at", debutJour).neq("statut", "annulee")),
    compter(
      base()
        .in("mode_paiement", ["wave", "orange_money"])
        .is("paiement_recu_le", null)
        .neq("statut", "annulee"),
    ),
    supabase
      .from("commandes")
      .select("total")
      .gte("created_at", debutMois)
      .neq("statut", "annulee"),
  ]);
  if (mois.error) throw new Error(`Lecture des statistiques : ${mois.error.message}`);
  return {
    aTraiter,
    aujourdhui,
    paiementsAVerifier,
    chiffreDuMois: mois.data.reduce((s, c) => s + c.total, 0),
    commandesDuMois: mois.data.length,
  };
}

/** Toutes les zones, y compris masquées (administration). */
export async function listerZonesAdmin() {
  const { supabase } = await exigerAdmin();
  const { data, error } = await supabase
    .from("zones_livraison")
    .select("id, nom, frais, delai, ordre, active")
    .order("ordre");
  if (error) throw new Error(`Lecture des zones : ${error.message}`);
  return data as {
    id: number;
    nom: string;
    frais: number;
    delai: string;
    ordre: number;
    active: boolean;
  }[];
}
