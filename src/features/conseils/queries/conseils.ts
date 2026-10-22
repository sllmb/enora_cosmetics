import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { exigerAdmin } from "@/features/compte/serveur";
import { supabaseEstConfiguree } from "@/shared/config/env";
import { creerClientPublic, urlPublique } from "@/shared/supabase/public";
import { estPoliceTitre } from "../lib/polices";
import type { Article } from "../types";

export const TAG_ARTICLES = "articles";

const ligneSchema = z.object({
  id: z.number(),
  slug: z.string(),
  titre: z.string(),
  extrait: z.string().nullable(),
  contenu: z.string(),
  image_chemin: z.string().nullable(),
  publie_le: z.string().nullable(),
  updated_at: z.string(),
  police_titre: z.string(),
});

const COLONNES =
  "id, slug, titre, extrait, contenu, image_chemin, publie_le, updated_at, police_titre";

function versArticle(donnees: unknown): Article {
  const a = ligneSchema.parse(donnees);
  return {
    id: a.id,
    slug: a.slug,
    titre: a.titre,
    extrait: a.extrait ?? "",
    contenu: a.contenu,
    imageChemin: a.image_chemin,
    imageUrl: a.image_chemin ? urlPublique("produits", a.image_chemin) : null,
    publieLe: a.publie_le,
    misAJourLe: a.updated_at,
    policeTitre: estPoliceTitre(a.police_titre) ? a.police_titre : "classique",
  };
}

/** Articles publiés, du plus récent au plus ancien (RLS : publie_le passé). */
export async function listerArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_ARTICLES);
  if (!supabaseEstConfiguree()) return [];
  const { data, error } = await creerClientPublic()
    .from("articles")
    .select(COLONNES)
    .not("publie_le", "is", null)
    .order("publie_le", { ascending: false });
  if (error) throw new Error(`Lecture des articles : ${error.message}`);
  return data.map(versArticle);
}

export async function lireArticle(slug: string): Promise<Article | null> {
  return (await listerArticles()).find((a) => a.slug === slug) ?? null;
}

/** Administration : brouillons compris, jamais en cache. */
export async function listerArticlesAdmin(): Promise<Article[]> {
  const { supabase } = await exigerAdmin();
  const { data, error } = await supabase
    .from("articles")
    .select(COLONNES)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Lecture des articles : ${error.message}`);
  return data.map(versArticle);
}

export async function lireArticleAdmin(id: number): Promise<Article | null> {
  const { supabase } = await exigerAdmin();
  const { data, error } = await supabase
    .from("articles")
    .select(COLONNES)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Lecture de l'article : ${error.message}`);
  return data ? versArticle(data) : null;
}
