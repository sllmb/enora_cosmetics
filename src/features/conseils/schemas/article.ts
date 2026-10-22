import { z } from "zod";

export const articleSchema = z.object({
  titre: z
    .string()
    .trim()
    .min(3, "Le titre est obligatoire.")
    .max(120, "120 caractères au maximum."),
  extrait: z
    .string()
    .trim()
    .max(300, "300 caractères au maximum.")
    .optional()
    .transform((v) => v || null),
  contenu: z
    .string()
    .trim()
    .min(20, "Le texte de l'article est trop court.")
    .max(20000, "20 000 caractères au maximum."),
  publie: z.boolean(),
});

export type ArticleSaisi = z.input<typeof articleSchema>;
export type ArticleValide = z.output<typeof articleSchema>;

/** Résumé affiché dans les listes : l'extrait, sinon le début du texte sans Markdown. */
export function resumeArticle(article: { extrait: string; contenu: string }, longueur = 160) {
  if (article.extrait) return article.extrait;
  const texte = article.contenu
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return texte.length > longueur ? `${texte.slice(0, longueur).replace(/\s+\S*$/, "")}…` : texte;
}
