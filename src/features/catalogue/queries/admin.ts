import "server-only";
import { z } from "zod";
import { exigerAdmin } from "@/features/compte/serveur";
import { urlPublique } from "@/shared/supabase/public";
import { formeDe } from "../lib/lignes";
import type { FamilleOlfactive, FormeVisuel } from "../types";

/*
 * Lectures de l'administration : tous les produits et catégories, y compris
 * inactifs (RLS administrateur). Jamais mises en cache.
 */

export type ImageAdmin = { id: number; chemin: string; url: string; alt: string; ordre: number };

export type ProduitAdmin = {
  id: number;
  slug: string;
  nom: string;
  categorieId: number;
  categorieNom: string;
  accroche: string;
  contenance: string;
  prix: number;
  prixPromo: number | null;
  stock: number;
  description: string;
  conseilsUtilisation: string;
  composition: string;
  familleOlfactive: FamilleOlfactive | null;
  notesOlfactives: { tete: string[]; coeur: string[]; fond: string[] } | null;
  estNouveaute: boolean;
  vedette: boolean;
  actif: boolean;
  forme: FormeVisuel;
  images: ImageAdmin[];
};

export type CategorieAdmin = {
  id: number;
  slug: string;
  nom: string;
  description: string;
  ordre: number;
  active: boolean;
  nombreProduits: number;
};

const notes = z.array(z.string()).catch([]);

const produitSchema = z.object({
  id: z.number(),
  slug: z.string(),
  nom: z.string(),
  categorie_id: z.number(),
  accroche: z.string().nullable(),
  contenance: z.string().nullable(),
  prix: z.number(),
  prix_promo: z.number().nullable(),
  stock: z.number(),
  description: z.string().nullable(),
  conseils_utilisation: z.string().nullable(),
  composition: z.string().nullable(),
  famille_olfactive: z
    .enum(["floral", "oriental", "frais", "musque", "gourmand", "boise"])
    .nullable()
    .catch(null),
  notes_olfactives: z.object({ tete: notes, coeur: notes, fond: notes }).nullable().catch(null),
  est_nouveaute: z.boolean(),
  vedette: z.boolean(),
  actif: z.boolean(),
  categories: z.object({ nom: z.string(), slug: z.string() }),
  produit_images: z.array(
    z.object({ id: z.number(), chemin: z.string(), alt: z.string(), ordre: z.number() }),
  ),
});

const COLONNES = `id, slug, nom, categorie_id, accroche, contenance, prix, prix_promo, stock,
  description, conseils_utilisation, composition, famille_olfactive, notes_olfactives,
  est_nouveaute, vedette, actif, categories(nom, slug), produit_images(id, chemin, alt, ordre)`;

function versProduitAdmin(donnees: unknown): ProduitAdmin {
  const p = produitSchema.parse(donnees);
  return {
    id: p.id,
    slug: p.slug,
    nom: p.nom,
    categorieId: p.categorie_id,
    categorieNom: p.categories.nom,
    accroche: p.accroche ?? "",
    contenance: p.contenance ?? "",
    prix: p.prix,
    prixPromo: p.prix_promo,
    stock: p.stock,
    description: p.description ?? "",
    conseilsUtilisation: p.conseils_utilisation ?? "",
    composition: p.composition ?? "",
    familleOlfactive: p.famille_olfactive,
    notesOlfactives: p.notes_olfactives,
    estNouveaute: p.est_nouveaute,
    vedette: p.vedette,
    actif: p.actif,
    forme: formeDe(p.categories.slug),
    images: [...p.produit_images]
      .sort((a, b) => a.ordre - b.ordre)
      .map((i) => ({ ...i, url: urlPublique("produits", i.chemin) })),
  };
}

export async function listerProduitsAdmin(): Promise<ProduitAdmin[]> {
  const { supabase } = await exigerAdmin();
  const { data, error } = await supabase
    .from("produits")
    .select(COLONNES)
    .order("actif", { ascending: false })
    .order("nom");
  if (error) throw new Error(`Lecture des produits : ${error.message}`);
  return data.map(versProduitAdmin);
}

export async function lireProduitAdmin(id: number): Promise<ProduitAdmin | null> {
  const { supabase } = await exigerAdmin();
  const { data, error } = await supabase
    .from("produits")
    .select(COLONNES)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Lecture du produit : ${error.message}`);
  return data ? versProduitAdmin(data) : null;
}

const categorieSchema = z.object({
  id: z.number(),
  slug: z.string(),
  nom: z.string(),
  description: z.string().nullable(),
  ordre: z.number(),
  active: z.boolean(),
  produits: z.array(z.object({ count: z.number() })),
});

export async function listerCategoriesAdmin(): Promise<CategorieAdmin[]> {
  const { supabase } = await exigerAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, nom, description, ordre, active, produits(count)")
    .order("ordre");
  if (error) throw new Error(`Lecture des catégories : ${error.message}`);
  return z
    .array(categorieSchema)
    .parse(data)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      nom: c.nom,
      description: c.description ?? "",
      ordre: c.ordre,
      active: c.active,
      nombreProduits: c.produits[0]?.count ?? 0,
    }));
}

/** Produits actifs à 5 unités ou moins (tableau de bord). */
export async function listerStocksBas(seuil = 5) {
  const { supabase } = await exigerAdmin();
  const { data, error } = await supabase
    .from("produits")
    .select("id, nom, stock")
    .eq("actif", true)
    .lte("stock", seuil)
    .order("stock");
  if (error) throw new Error(`Lecture des stocks : ${error.message}`);
  return data as { id: number; nom: string; stock: number }[];
}
