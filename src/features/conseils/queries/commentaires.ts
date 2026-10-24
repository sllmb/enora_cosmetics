import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { exigerAdmin } from "@/features/compte/serveur";
import { supabaseEstConfiguree } from "@/shared/config/env";
import { creerClientPublic } from "@/shared/supabase/public";
import { creerClientServeur } from "@/shared/supabase/serveur";
import type { Commentaire, CommentaireAdmin, StatutCommentaire } from "../types";

export const TAG_COMMENTAIRES = "commentaires";

const ligneSchema = z.object({
  id: z.number(),
  auteur: z.string(),
  contenu: z.string(),
  created_at: z.string(),
});

const versCommentaire = (l: z.infer<typeof ligneSchema>): Commentaire => ({
  id: l.id,
  auteur: l.auteur,
  contenu: l.contenu,
  creeLe: l.created_at,
});

/** RM-14 : seuls les commentaires publiés, du plus ancien au plus récent. */
export async function listerCommentaires(articleId: number): Promise<Commentaire[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_COMMENTAIRES);
  if (!supabaseEstConfiguree()) return [];
  const { data, error } = await creerClientPublic()
    .from("commentaires_articles")
    .select("id, auteur, contenu, created_at")
    .eq("article_id", articleId)
    .eq("statut", "publie")
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) throw new Error(`Lecture des commentaires : ${error.message}`);
  return z.array(ligneSchema).parse(data).map(versCommentaire);
}

/** La lectrice est-elle connectée ? Lit la session : à appeler sous <Suspense>. */
export async function estConnectee(): Promise<boolean> {
  if (!supabaseEstConfiguree()) return false;
  const {
    data: { user },
  } = await (await creerClientServeur()).auth.getUser();
  return Boolean(user);
}

const ligneAdminSchema = ligneSchema.extend({
  statut: z.enum(["en_attente", "publie", "refuse"]),
  articles: z.object({ titre: z.string(), slug: z.string() }),
});

export async function listerCommentairesAdmin(
  statut?: StatutCommentaire,
): Promise<CommentaireAdmin[]> {
  const { supabase } = await exigerAdmin();
  let requete = supabase
    .from("commentaires_articles")
    .select("id, auteur, contenu, created_at, statut, articles(titre, slug)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (statut) requete = requete.eq("statut", statut);
  const { data, error } = await requete;
  if (error) throw new Error(`Lecture des commentaires : ${error.message}`);
  return z
    .array(ligneAdminSchema)
    .parse(data)
    .map((l) => ({
      ...versCommentaire(l),
      statut: l.statut,
      articleTitre: l.articles.titre,
      articleSlug: l.articles.slug,
    }));
}

export async function compterCommentairesEnAttente(): Promise<number> {
  const { supabase } = await exigerAdmin();
  const { count } = await supabase
    .from("commentaires_articles")
    .select("id", { count: "exact", head: true })
    .eq("statut", "en_attente");
  return count ?? 0;
}
