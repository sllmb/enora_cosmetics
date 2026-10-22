"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { exigerAdmin } from "@/features/compte/serveur";
import { slugifier } from "@/shared/lib/format";
import { creerClientService } from "@/shared/supabase/service";
import { TAG_ARTICLES } from "../queries/conseils";
import { articleSchema } from "../schemas/article";
import type { ResultatArticle } from "../types";

const idSchema = z.coerce.number().int().positive();

/** Les fichiers du Storage se suppriment avec la clé service_role (voir catalogue). */
async function supprimerImage(chemin: string | null) {
  if (!chemin) return;
  const { error } = await creerClientService().storage.from("produits").remove([chemin]);
  if (error) console.error("Suppression de l'image d'article :", chemin, error);
}

export async function enregistrerArticle(
  id: number | null,
  donnees: unknown,
): Promise<ResultatArticle> {
  const { supabase } = await exigerAdmin();
  const saisie = articleSchema.safeParse(donnees);
  if (!saisie.success) {
    const erreurs: Record<string, string> = {};
    for (const issue of saisie.error.issues) erreurs[String(issue.path[0] ?? "")] ??= issue.message;
    return { ok: false, message: "Certains champs sont à corriger.", erreurs };
  }
  const { titre, extrait, contenu, publie, policeTitre } = saisie.data;

  // Date de publication conservée si l'article était déjà en ligne.
  let publieLe: string | null = null;
  if (publie) {
    const existant = id
      ? (await supabase.from("articles").select("publie_le").eq("id", id).maybeSingle()).data
      : null;
    publieLe = existant?.publie_le ?? new Date().toISOString();
  }
  const ligne = { titre, extrait, contenu, publie_le: publieLe, police_titre: policeTitre };

  let resultat;
  if (id) {
    resultat = await supabase.from("articles").update(ligne).eq("id", id).select("id").single();
  } else {
    // Slug fixé à la création : les liens partagés restent valables.
    const base = slugifier(titre) || "conseil";
    const { data } = await supabase.from("articles").select("slug").like("slug", `${base}%`);
    const pris = new Set((data ?? []).map((l: { slug: string }) => l.slug));
    let slug = base;
    for (let n = 2; pris.has(slug); n++) slug = `${base}-${n}`;
    resultat = await supabase
      .from("articles")
      .insert({ ...ligne, slug })
      .select("id")
      .single();
  }
  if (resultat.error) {
    console.error("enregistrerArticle :", resultat.error);
    return { ok: false, message: "L'article n'a pas pu être enregistré." };
  }
  updateTag(TAG_ARTICLES);
  return { ok: true, id: resultat.data.id };
}

export async function definirImageArticle(
  id: number,
  chemin: string | null,
): Promise<ResultatArticle> {
  const { supabase } = await exigerAdmin();
  if (!idSchema.safeParse(id).success) return { ok: false, message: "Article inconnu." };
  if (chemin !== null && !/^articles\/[\w-]+\.webp$/.test(chemin)) {
    return { ok: false, message: "Image invalide." };
  }
  const { data: avant } = await supabase
    .from("articles")
    .select("image_chemin")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("articles").update({ image_chemin: chemin }).eq("id", id);
  if (error) return { ok: false, message: "L'image n'a pas pu être enregistrée." };
  if (avant?.image_chemin && avant.image_chemin !== chemin)
    await supprimerImage(avant.image_chemin);
  updateTag(TAG_ARTICLES);
  return { ok: true };
}

export async function supprimerArticle(id: number): Promise<ResultatArticle> {
  const { supabase } = await exigerAdmin();
  const { data, error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)
    .select("image_chemin")
    .single();
  if (error) return { ok: false, message: "L'article n'a pas pu être supprimé." };
  await supprimerImage(data.image_chemin);
  updateTag(TAG_ARTICLES);
  return { ok: true };
}
