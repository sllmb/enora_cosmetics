import { estEpuise, prixEffectif, type Produit } from "@/features/catalogue";

/*
 * Règles du panier, sans effet de bord. Le panier ne garde que des slugs et
 * des quantités : prix, noms et stock sont toujours relus dans le catalogue,
 * et le serveur recalcule tout à la commande (RM-08).
 */

/** RM-05 : 1 à 20 exemplaires par produit. */
export const QUANTITE_MAX = 20;

export type LignePanier = { slug: string; quantite: number };

const borner = (quantite: number, stock: number) =>
  Math.max(0, Math.min(Math.trunc(quantite), QUANTITE_MAX, stock));

/** Ajoute (ou cumule) en respectant le stock ; renvoie aussi la quantité réellement ajoutée. */
export function ajouter(
  lignes: LignePanier[],
  slug: string,
  quantite: number,
  stock: number,
): { lignes: LignePanier[]; ajoute: number } {
  const actuelle = lignes.find((l) => l.slug === slug)?.quantite ?? 0;
  const finale = borner(actuelle + quantite, stock);
  if (finale <= actuelle) return { lignes, ajoute: 0 };
  const suivantes =
    actuelle > 0
      ? lignes.map((l) => (l.slug === slug ? { ...l, quantite: finale } : l))
      : [...lignes, { slug, quantite: finale }];
  return { lignes: suivantes, ajoute: finale - actuelle };
}

export function modifier(lignes: LignePanier[], slug: string, quantite: number): LignePanier[] {
  const bornee = borner(quantite, QUANTITE_MAX);
  return bornee === 0
    ? retirer(lignes, slug)
    : lignes.map((l) => (l.slug === slug ? { ...l, quantite: bornee } : l));
}

export function retirer(lignes: LignePanier[], slug: string): LignePanier[] {
  return lignes.filter((l) => l.slug !== slug);
}

export function compterArticles(lignes: LignePanier[]): number {
  return lignes.reduce((total, l) => total + l.quantite, 0);
}

export type Probleme = "indisponible" | "epuise" | "stock";

export type LigneDetaillee = {
  slug: string;
  quantite: number;
  produit: Produit | null;
  prixUnitaire: number;
  total: number;
  probleme: Probleme | null;
};

/**
 * Croise le panier et le catalogue actuel. Une ligne à problème (produit
 * retiré, épuisé, stock insuffisant) est signalée et ne compte pas dans le total.
 */
export function detaillerPanier(lignes: LignePanier[], produits: Produit[]) {
  const parSlug = new Map(produits.map((p) => [p.slug, p]));
  const detail: LigneDetaillee[] = lignes.map(({ slug, quantite }) => {
    const produit = parSlug.get(slug) ?? null;
    const probleme: Probleme | null = !produit
      ? "indisponible"
      : estEpuise(produit)
        ? "epuise"
        : quantite > produit.stock
          ? "stock"
          : null;
    const prixUnitaire = produit ? prixEffectif(produit) : 0;
    return {
      slug,
      quantite,
      produit,
      prixUnitaire,
      total: probleme ? 0 : prixUnitaire * quantite,
      probleme,
    };
  });
  return {
    lignes: detail,
    sousTotal: detail.reduce((s, l) => s + l.total, 0),
    nombreArticles: detail.reduce((s, l) => s + (l.probleme ? 0 : l.quantite), 0),
    commandable: detail.length > 0 && detail.every((l) => l.probleme === null),
  };
}
