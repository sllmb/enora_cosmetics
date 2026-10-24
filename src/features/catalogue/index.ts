// API publique utilisable partout (navigateur compris). Les lectures de
// données, réservées au serveur, sont dans ./serveur.ts.
export { BadgesProduit } from "./components/BadgesProduit";
export { CatalogueFiltrable } from "./components/CatalogueFiltrable";
export { CarteProduit } from "./components/CarteProduit";
export { DetailsProduit } from "./components/DetailsProduit";
export { GalerieProduit } from "./components/GalerieProduit";
export { GrilleProduits } from "./components/GrilleProduits";
export { NotesOlfactives } from "./components/NotesOlfactives";
export { VisuelProduit } from "./components/VisuelProduit";
export { estEnPromo, estEpuise, LIBELLES_FAMILLE, prixEffectif } from "./lib/produit";
export type { Categorie, Produit } from "./types";
