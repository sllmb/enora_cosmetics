export type FamilleOlfactive = "floral" | "oriental" | "frais" | "musque" | "gourmand" | "boise";

/** Forme de l'illustration utilisée tant qu'un produit n'a pas de photo. */
export type FormeVisuel = "stick" | "spray" | "flacon" | "savon";

export type NotesOlfactives = { tete: string[]; coeur: string[]; fond: string[] };

export type Categorie = {
  slug: string;
  nom: string;
  description: string;
  forme: FormeVisuel;
};

export type ImageProduit = { url: string; alt: string };

export type Produit = {
  slug: string;
  nom: string;
  categorieSlug: string;
  accroche: string;
  description: string;
  conseilsUtilisation: string | null;
  composition: string | null;
  contenance: string;
  prix: number;
  prixPromo: number | null;
  stock: number;
  estNouveaute: boolean;
  familleOlfactive: FamilleOlfactive | null;
  notesOlfactives: NotesOlfactives | null;
  forme: FormeVisuel;
  images: ImageProduit[];
};
