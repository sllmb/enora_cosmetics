import type { StatutCommande } from "../types";

export const STATUTS: Record<
  StatutCommande,
  { libelle: string; ton: "neutre" | "doux" | "succes" | "danger" | "avertissement" }
> = {
  en_attente: { libelle: "En attente", ton: "avertissement" },
  confirmee: { libelle: "Confirmée", ton: "doux" },
  expediee: { libelle: "Expédiée", ton: "doux" },
  livree: { libelle: "Livrée", ton: "succes" },
  annulee: { libelle: "Annulée", ton: "neutre" },
};
