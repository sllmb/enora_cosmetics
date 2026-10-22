// API publique utilisable partout. Lectures serveur : ./serveur.ts ; écrans d'administration : ./admin.ts.
export { Etoiles } from "./components/Etoiles";
export { FormulaireAvis } from "./components/FormulaireAvis";
export { ListeAvis } from "./components/ListeAvis";
export { formaterNote, resumerAvis } from "./lib/avis";
export type { Avis, DroitAvis, ResumeAvis, StatutAvis } from "./types";
