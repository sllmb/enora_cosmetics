import type { Produit } from "../types";

/*
 * Produits montrés sur l'accueil, choisis à partir du catalogue (et non figés
 * dans le code) : la vedette désignée dans l'administration, puis les nouveautés,
 * en préférant toujours les produits qui ont une photo.
 */

const avecPhoto = (p: Produit) => p.images.length > 0;

/** Grande bande de l'accueil : la vedette, sinon une nouveauté avec photo, sinon la première nouveauté. */
export function choisirVedette(produits: Produit[]): Produit | null {
  return (
    produits.find((p) => p.vedette) ??
    produits.find((p) => p.estNouveaute && avecPhoto(p)) ??
    produits.find(avecPhoto) ??
    produits.find((p) => p.estNouveaute) ??
    produits[0] ??
    null
  );
}

/** Visuels du haut de l'accueil, sans doublon. */
export function choisirVisuelsAccueil(produits: Produit[], nombre = 3): Produit[] {
  const ordre = [
    ...produits.filter((p) => p.vedette),
    ...produits.filter((p) => p.estNouveaute && avecPhoto(p)),
    ...produits.filter(avecPhoto),
    ...produits.filter((p) => p.estNouveaute),
    ...produits,
  ];
  return [...new Map(ordre.map((p) => [p.slug, p])).values()].slice(0, nombre);
}
