import "server-only";

// Lectures du catalogue : Server Components et Server Actions uniquement.
export {
  lireProduitAdmin,
  listerCategoriesAdmin,
  listerProduitsAdmin,
  listerStocksBas,
  type CategorieAdmin,
  type ImageAdmin,
  type ProduitAdmin,
} from "./queries/admin";
export {
  lireCategorie,
  lireProduit,
  listerCategories,
  listerNouveautes,
  listerProduits,
  listerProduitsSimilaires,
  TAG_CATALOGUE,
} from "./queries/catalogue";
