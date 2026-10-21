// API publique utilisable partout. Lectures réservées au serveur : ./serveur.ts.
export { Confirmation } from "./components/Confirmation";
export { FormulaireCommande } from "./components/FormulaireCommande";
export { STATUTS } from "./lib/statuts";
export { MODES_PAIEMENT, type ModePaiement } from "./schemas/commande";
export type { CommandeAdmin, CommandeConfirmee, StatutCommande, ZoneLivraison } from "./types";
