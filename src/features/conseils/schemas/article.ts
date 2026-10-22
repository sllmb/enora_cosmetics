import { z } from "zod";
import { POLICES_TITRE } from "../lib/polices";

export const articleSchema = z.object({
  titre: z
    .string()
    .trim()
    .min(3, "Le titre est obligatoire.")
    .max(120, "120 caractères au maximum."),
  extrait: z
    .string()
    .trim()
    .max(600, "600 caractères au maximum.")
    .optional()
    .transform((v) => v || null),
  contenu: z
    .string()
    .trim()
    .min(20, "Le texte de l'article est trop court.")
    .max(20000, "20 000 caractères au maximum."),
  publie: z.boolean(),
  policeTitre: z.enum(POLICES_TITRE),
});

export type ArticleSaisi = z.input<typeof articleSchema>;
export type ArticleValide = z.output<typeof articleSchema>;

/**
 * Résumé court des cartes et de Google : l'extrait, sinon le début du texte sans
 * Markdown, coupé à « longueur » caractères (la page de garde affiche l'extrait entier).
 */
export function resumeArticle(article: { extrait: string; contenu: string }, longueur = 160) {
  const texte = article.extrait
    ? article.extrait.replace(/\s+/g, " ").trim()
    : article.contenu
        .replace(/\[\[produit:[^\]]*\]\]/g, "")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#>*_`~-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
  return texte.length > longueur ? `${texte.slice(0, longueur).replace(/\s+\S*$/, "")}…` : texte;
}
