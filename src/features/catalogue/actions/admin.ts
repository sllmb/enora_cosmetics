"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { exigerAdmin } from "@/features/compte/serveur";
import { slugifier } from "@/shared/lib/format";
import { creerClientService } from "@/shared/supabase/service";
import { TAG_CATALOGUE } from "../queries/catalogue";
import { categorieAdminSchema, produitAdminSchema } from "../schemas/admin";

/*
 * Écritures du catalogue. Chaque action vérifie l'administratrice
 * (exigerAdmin) ; la RLS (est_admin()) le revérifie en base. Le catalogue
 * public est rafraîchi immédiatement (updateTag).
 */

export type ResultatCatalogue =
  | { ok: true; id?: number }
  | { ok: false; message: string; erreurs?: Partial<Record<string, string>> };

type Supabase = Awaited<ReturnType<typeof exigerAdmin>>["supabase"];

function erreursDe(erreur: z.ZodError): ResultatCatalogue {
  const erreurs: Record<string, string> = {};
  for (const issue of erreur.issues) erreurs[String(issue.path[0] ?? "")] ??= issue.message;
  return { ok: false, message: "Certains champs sont à corriger.", erreurs };
}

/** Slug unique : « savon-ambre-noir », sinon « savon-ambre-noir-2 », etc. */
async function slugLibre(supabase: Supabase, table: "produits" | "categories", nom: string) {
  const base = slugifier(nom) || "produit";
  const { data } = await supabase.from(table).select("slug").like("slug", `${base}%`);
  const pris = new Set((data ?? []).map((l: { slug: string }) => l.slug));
  let slug = base;
  for (let n = 2; pris.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

const idSchema = z.coerce.number().int().positive();

/**
 * Supprime des photos du bucket. Le Storage exige un droit de lecture en plus
 * du droit de suppression : l'opération passe par la clé service_role, appelée
 * uniquement après exigerAdmin(). Un échec est journalisé (fichier orphelin).
 */
async function supprimerFichiers(chemins: string[]) {
  const { error } = await creerClientService().storage.from("produits").remove(chemins);
  if (error) console.error("Suppression des photos :", chemins, error);
}

export async function enregistrerProduit(
  id: number | null,
  donnees: unknown,
): Promise<ResultatCatalogue> {
  const { supabase } = await exigerAdmin();
  const saisie = produitAdminSchema.safeParse(donnees);
  if (!saisie.success) return erreursDe(saisie.error);
  const p = saisie.data;
  const notes = { tete: p.notesTete, coeur: p.notesCoeur, fond: p.notesFond };
  const ligne = {
    nom: p.nom,
    categorie_id: p.categorieId,
    accroche: p.accroche,
    contenance: p.contenance,
    prix: p.prix,
    prix_promo: p.prixPromo,
    stock: p.stock,
    description: p.description,
    conseils_utilisation: p.conseilsUtilisation,
    composition: p.composition,
    famille_olfactive: p.familleOlfactive,
    notes_olfactives: notes.tete.length + notes.coeur.length + notes.fond.length ? notes : null,
    est_nouveaute: p.estNouveaute,
    actif: p.actif,
  };

  // Le slug (adresse de la fiche) est fixé à la création et ne change plus :
  // les liens partagés restent valables même si le nom évolue.
  const requete = id
    ? supabase.from("produits").update(ligne).eq("id", id).select("id").single()
    : supabase
        .from("produits")
        .insert({ ...ligne, slug: await slugLibre(supabase, "produits", p.nom) })
        .select("id")
        .single();
  const { data, error } = await requete;
  if (error) {
    console.error("enregistrerProduit :", error);
    return { ok: false, message: "Le produit n'a pas pu être enregistré." };
  }
  updateTag(TAG_CATALOGUE);
  return { ok: true, id: data.id };
}

export async function supprimerProduit(id: number): Promise<ResultatCatalogue> {
  const { supabase } = await exigerAdmin();
  if (!idSchema.safeParse(id).success) return { ok: false, message: "Produit inconnu." };
  const { data: images } = await supabase
    .from("produit_images")
    .select("chemin")
    .eq("produit_id", id);
  // Les commandes passées gardent nom et prix (RM-06) : la suppression ne les modifie pas.
  const { error } = await supabase.from("produits").delete().eq("id", id);
  if (error) {
    console.error("supprimerProduit :", error);
    return { ok: false, message: "Le produit n'a pas pu être supprimé." };
  }
  if (images?.length) await supprimerFichiers(images.map((i) => i.chemin));
  updateTag(TAG_CATALOGUE);
  return { ok: true };
}

const imageSchema = z.object({
  produitId: idSchema,
  // Chemin déposé par le navigateur dans le bucket : <id du produit>/<nom>.webp
  chemin: z.string().regex(/^\d+\/[\w-]+\.(webp|jpe?g|png)$/),
  alt: z.string().trim().max(150),
});

export async function ajouterImage(donnees: unknown): Promise<ResultatCatalogue> {
  const { supabase } = await exigerAdmin();
  const saisie = imageSchema.safeParse(donnees);
  if (!saisie.success || !saisie.data.chemin.startsWith(`${saisie.data.produitId}/`)) {
    return { ok: false, message: "Photo invalide." };
  }
  const { produitId, chemin, alt } = saisie.data;
  const { data: dernieres } = await supabase
    .from("produit_images")
    .select("ordre")
    .eq("produit_id", produitId)
    .order("ordre", { ascending: false })
    .limit(1);
  const { error } = await supabase
    .from("produit_images")
    .insert({ produit_id: produitId, chemin, alt, ordre: (dernieres?.[0]?.ordre ?? -1) + 1 });
  if (error) {
    console.error("ajouterImage :", error);
    return { ok: false, message: "La photo n'a pas pu être enregistrée." };
  }
  updateTag(TAG_CATALOGUE);
  return { ok: true };
}

export async function supprimerImage(imageId: number): Promise<ResultatCatalogue> {
  const { supabase } = await exigerAdmin();
  const { data, error } = await supabase
    .from("produit_images")
    .delete()
    .eq("id", imageId)
    .select("chemin")
    .single();
  if (error) return { ok: false, message: "La photo n'a pas pu être supprimée." };
  await supprimerFichiers([data.chemin]);
  updateTag(TAG_CATALOGUE);
  return { ok: true };
}

/** La photo choisie passe en premier (c'est elle qui s'affiche dans la boutique). */
export async function definirImagePrincipale(imageId: number): Promise<ResultatCatalogue> {
  const { supabase } = await exigerAdmin();
  const { data: image } = await supabase
    .from("produit_images")
    .select("produit_id")
    .eq("id", imageId)
    .single();
  if (!image) return { ok: false, message: "Photo introuvable." };
  const { data: premiere } = await supabase
    .from("produit_images")
    .select("ordre")
    .eq("produit_id", image.produit_id)
    .order("ordre")
    .limit(1);
  const { error } = await supabase
    .from("produit_images")
    .update({ ordre: (premiere?.[0]?.ordre ?? 0) - 1 })
    .eq("id", imageId);
  if (error) return { ok: false, message: "La photo principale n'a pas pu être changée." };
  updateTag(TAG_CATALOGUE);
  return { ok: true };
}

export async function enregistrerCategorie(
  id: number | null,
  donnees: unknown,
): Promise<ResultatCatalogue> {
  const { supabase } = await exigerAdmin();
  const saisie = categorieAdminSchema.safeParse(donnees);
  if (!saisie.success) return erreursDe(saisie.error);
  const ligne = saisie.data;
  const { error } = id
    ? await supabase.from("categories").update(ligne).eq("id", id)
    : await supabase
        .from("categories")
        .insert({ ...ligne, slug: await slugLibre(supabase, "categories", ligne.nom) });
  if (error) {
    console.error("enregistrerCategorie :", error);
    return { ok: false, message: "La catégorie n'a pas pu être enregistrée." };
  }
  updateTag(TAG_CATALOGUE);
  return { ok: true };
}

export async function supprimerCategorie(id: number): Promise<ResultatCatalogue> {
  const { supabase } = await exigerAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  // Clé étrangère « on delete restrict » : une catégorie qui contient des produits est refusée.
  if (error?.code === "23503") {
    return {
      ok: false,
      message: "Cette catégorie contient des produits : déplacez-les ou désactivez-la plutôt.",
    };
  }
  if (error) return { ok: false, message: "La catégorie n'a pas pu être supprimée." };
  updateTag(TAG_CATALOGUE);
  return { ok: true };
}
