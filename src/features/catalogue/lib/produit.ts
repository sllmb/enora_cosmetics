import type { FamilleOlfactive, Produit } from "../types";

/** RM-03 : un prix promo n'est pris en compte que s'il est strictement inférieur au prix. */
export function estEnPromo(produit: Pick<Produit, "prix" | "prixPromo">): boolean {
  return produit.prixPromo != null && produit.prixPromo < produit.prix;
}

export function prixEffectif(produit: Pick<Produit, "prix" | "prixPromo">): number {
  return estEnPromo(produit) ? (produit.prixPromo as number) : produit.prix;
}

/** Remise arrondie à l'entier, ex. 13 pour -13 %. 0 hors promotion. */
export function pourcentageRemise(produit: Pick<Produit, "prix" | "prixPromo">): number {
  return estEnPromo(produit) ? Math.round((1 - prixEffectif(produit) / produit.prix) * 100) : 0;
}

/** RM-04 : un produit sans stock reste visible mais n'est pas commandable. */
export function estEpuise(produit: Pick<Produit, "stock">): boolean {
  return produit.stock <= 0;
}

export const LIBELLES_FAMILLE: Record<FamilleOlfactive, string> = {
  floral: "Floral",
  oriental: "Oriental",
  frais: "Frais",
  musque: "Musqué",
  gourmand: "Gourmand",
  boise: "Boisé",
};
