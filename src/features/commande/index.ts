// API publique utilisable partout. Lectures réservées au serveur : ./serveur.ts.
export { Confirmation } from "./components/Confirmation";
export { FormulaireCommande } from "./components/FormulaireCommande";
export { MODES_PAIEMENT, type ModePaiement } from "./schemas/commande";
export type { CommandeConfirmee, ZoneLivraison } from "./types";
