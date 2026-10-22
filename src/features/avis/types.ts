export type StatutAvis = "en_attente" | "publie" | "refuse";

export type Avis = {
  id: number;
  /** Prénom et initiale, ex. « Awa N. » : jamais le nom complet. */
  auteur: string;
  note: number;
  commentaire: string | null;
  creeLe: string;
};

export type ResumeAvis = { moyenne: number; nombre: number };

export type AvisAdmin = Avis & {
  statut: StatutAvis;
  produitNom: string;
  produitSlug: string;
};

/** Ce que la cliente connectée peut faire sur la fiche d'un produit. */
export type DroitAvis =
  | "connexion" // non connectée
  | "deja" // a déjà donné son avis (RM-10 : un seul par produit)
  | "non_eligible" // n'a pas encore reçu ce produit
  | "eligible";

export type ResultatAvis = { ok: true; message: string } | { ok: false; message: string };
