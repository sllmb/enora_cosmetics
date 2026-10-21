import { CATEGORIES_DEMO, PRODUITS_DEMO } from "../lib/donnees-demo";
import type { Categorie, Produit } from "../types";

/*
 * Seul point d'accès aux données du catalogue. Les fonctions sont déjà
 * asynchrones : au branchement de Supabase (S0-07), seul leur corps change
 * ("use cache" + requêtes), pas les pages qui les appellent.
 */

export async function listerCategories(): Promise<Categorie[]> {
  return CATEGORIES_DEMO;
}

export async function lireCategorie(slug: string): Promise<Categorie | null> {
  return CATEGORIES_DEMO.find((c) => c.slug === slug) ?? null;
}

export async function listerProduits(filtre: { categorieSlug?: string } = {}): Promise<Produit[]> {
  return PRODUITS_DEMO.filter(
    (p) => !filtre.categorieSlug || p.categorieSlug === filtre.categorieSlug,
  );
}

export async function lireProduit(slug: string): Promise<Produit | null> {
  return PRODUITS_DEMO.find((p) => p.slug === slug) ?? null;
}

export async function listerNouveautes(limite = 4): Promise<Produit[]> {
  return PRODUITS_DEMO.filter((p) => p.estNouveaute).slice(0, limite);
}

/** Même catégorie d'abord, puis même famille olfactive ; jamais le produit lui-même. */
export async function listerProduitsSimilaires(produit: Produit, limite = 4): Promise<Produit[]> {
  const autres = PRODUITS_DEMO.filter((p) => p.slug !== produit.slug);
  const score = (p: Produit) =>
    (p.categorieSlug === produit.categorieSlug ? 2 : 0) +
    (produit.familleOlfactive && p.familleOlfactive === produit.familleOlfactive ? 1 : 0);
  return [...autres].sort((a, b) => score(b) - score(a)).slice(0, limite);
}
