import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { supabaseEstConfiguree } from "@/shared/config/env";
import { creerClientPublic, urlPublique } from "@/shared/supabase/public";
import { CATEGORIES_DEMO, PRODUITS_DEMO } from "../lib/donnees-demo";
import {
  ligneCategorieSchema,
  ligneProduitSchema,
  versCategorie,
  versProduit,
} from "../lib/lignes";
import type { Categorie, Produit } from "../types";

/*
 * Seul point d'accès aux données du catalogue. Lecture dans Supabase (clé
 * publique, RLS) mise en cache une heure et étiquetée « catalogue » : les
 * actions d'administration l'invalideront avec revalidateTag("catalogue").
 * Sans clés Supabase (CI, nouvelle installation), le catalogue de
 * démonstration — identique à supabase/seed.sql — prend le relais.
 */

export const TAG_CATALOGUE = "catalogue";

// RM-02 : seuls les produits actifs d'une catégorie active sont publics
// (la RLS filtre les produits, la jointure !inner filtre les catégories).
const COLONNES_PRODUIT = `id, slug, nom, accroche, description, conseils_utilisation, composition,
  contenance, prix, prix_promo, stock, est_nouveaute, famille_olfactive, notes_olfactives,
  categories!inner(slug), produit_images(chemin, alt, ordre)`;

async function lireToutLeCatalogue(): Promise<{ categories: Categorie[]; produits: Produit[] }> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_CATALOGUE);

  if (!supabaseEstConfiguree()) {
    return { categories: CATEGORIES_DEMO, produits: PRODUITS_DEMO };
  }

  const supabase = creerClientPublic();
  const [categories, produits] = await Promise.all([
    supabase.from("categories").select("slug, nom, description").eq("active", true).order("ordre"),
    supabase
      .from("produits")
      .select(COLONNES_PRODUIT)
      .eq("categories.active", true)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
  ]);
  if (categories.error) throw new Error(`Lecture des catégories : ${categories.error.message}`);
  if (produits.error) throw new Error(`Lecture des produits : ${produits.error.message}`);

  return {
    categories: z.array(ligneCategorieSchema).parse(categories.data).map(versCategorie),
    produits: z
      .array(ligneProduitSchema)
      .parse(produits.data)
      .map((ligne) => versProduit(ligne, (chemin) => urlPublique("produits", chemin))),
  };
}

export async function listerCategories(): Promise<Categorie[]> {
  return (await lireToutLeCatalogue()).categories;
}

export async function lireCategorie(slug: string): Promise<Categorie | null> {
  return (await listerCategories()).find((c) => c.slug === slug) ?? null;
}

export async function listerProduits(filtre: { categorieSlug?: string } = {}): Promise<Produit[]> {
  const { produits } = await lireToutLeCatalogue();
  return produits.filter((p) => !filtre.categorieSlug || p.categorieSlug === filtre.categorieSlug);
}

export async function lireProduit(slug: string): Promise<Produit | null> {
  return (await listerProduits()).find((p) => p.slug === slug) ?? null;
}

export async function listerNouveautes(limite = 4): Promise<Produit[]> {
  return (await listerProduits()).filter((p) => p.estNouveaute).slice(0, limite);
}

/** Même catégorie d'abord, puis même famille olfactive ; jamais le produit lui-même. */
export async function listerProduitsSimilaires(produit: Produit, limite = 4): Promise<Produit[]> {
  const autres = (await listerProduits()).filter((p) => p.slug !== produit.slug);
  const score = (p: Produit) =>
    (p.categorieSlug === produit.categorieSlug ? 2 : 0) +
    (produit.familleOlfactive && p.familleOlfactive === produit.familleOlfactive ? 1 : 0);
  return [...autres].sort((a, b) => score(b) - score(a)).slice(0, limite);
}
