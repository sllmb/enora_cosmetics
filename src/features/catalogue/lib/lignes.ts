import { z } from "zod";
import type { Categorie, FormeVisuel, Produit } from "../types";

/*
 * Lignes renvoyées par Supabase, validées avant usage : une colonne renommée
 * ou une donnée inattendue produit une erreur claire au lieu d'un affichage cassé.
 */

const FORME_PAR_CATEGORIE: Record<string, FormeVisuel> = {
  deodorants: "stick",
  "huiles-parfumees": "flacon",
  savons: "savon",
};

export const formeDe = (categorieSlug: string): FormeVisuel =>
  FORME_PAR_CATEGORIE[categorieSlug] ?? "flacon";

const listeNotes = z.array(z.string()).catch([]);

export const ligneCategorieSchema = z.object({
  slug: z.string(),
  nom: z.string(),
  description: z.string().nullable(),
});

export const ligneProduitSchema = z.object({
  id: z.number(),
  slug: z.string(),
  nom: z.string(),
  accroche: z.string().nullable(),
  description: z.string().nullable(),
  conseils_utilisation: z.string().nullable(),
  composition: z.string().nullable(),
  contenance: z.string().nullable(),
  prix: z.number().int(),
  prix_promo: z.number().int().nullable(),
  stock: z.number().int(),
  est_nouveaute: z.boolean(),
  famille_olfactive: z
    .enum(["floral", "oriental", "frais", "musque", "gourmand", "boise"])
    .nullable()
    .catch(null),
  notes_olfactives: z
    .object({ tete: listeNotes, coeur: listeNotes, fond: listeNotes })
    .nullable()
    .catch(null),
  categories: z.object({ slug: z.string() }),
  produit_images: z.array(z.object({ chemin: z.string(), alt: z.string(), ordre: z.number() })),
});

export type LigneProduit = z.infer<typeof ligneProduitSchema>;

export function versCategorie(ligne: z.infer<typeof ligneCategorieSchema>): Categorie {
  return {
    slug: ligne.slug,
    nom: ligne.nom,
    description: ligne.description ?? "",
    forme: formeDe(ligne.slug),
  };
}

export function versProduit(ligne: LigneProduit, urlImage: (chemin: string) => string): Produit {
  return {
    id: ligne.id,
    slug: ligne.slug,
    nom: ligne.nom,
    categorieSlug: ligne.categories.slug,
    accroche: ligne.accroche ?? "",
    description: ligne.description ?? "",
    conseilsUtilisation: ligne.conseils_utilisation,
    composition: ligne.composition,
    contenance: ligne.contenance ?? "",
    prix: ligne.prix,
    prixPromo: ligne.prix_promo,
    stock: ligne.stock,
    estNouveaute: ligne.est_nouveaute,
    familleOlfactive: ligne.famille_olfactive,
    notesOlfactives: ligne.notes_olfactives,
    forme: formeDe(ligne.categories.slug),
    images: [...ligne.produit_images]
      .sort((a, b) => a.ordre - b.ordre)
      .map((image) => ({ url: urlImage(image.chemin), alt: image.alt || ligne.nom })),
  };
}
