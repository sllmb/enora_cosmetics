import type { ModePaiement } from "./schemas/commande";

export type ZoneLivraison = { id: number; nom: string; frais: number; delai: string };

export type StatutCommande = "en_attente" | "confirmee" | "expediee" | "livree" | "annulee";

export type CommandeConfirmee = {
  reference: string;
  nom: string;
  telephone: string;
  adresse: string;
  zoneNom: string;
  modePaiement: ModePaiement;
  statut: StatutCommande;
  sousTotal: number;
  fraisLivraison: number;
  total: number;
  creeLe: string;
  lignes: { nom: string; prixUnitaire: number; quantite: number; total: number }[];
};

export type ResultatCommande =
  | { ok: true; reference: string; cle: string }
  | {
      ok: false;
      message: string;
      /** Erreurs par champ du formulaire. */
      erreurs?: Partial<Record<string, string>>;
      /** Produit en cause (stock, indisponible) : la cliente est renvoyée vers son panier. */
      produit?: string;
    };
