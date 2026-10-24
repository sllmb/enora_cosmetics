import type { PoliceTitre } from "./lib/polices";

export type Article = {
  id: number;
  slug: string;
  titre: string;
  extrait: string;
  /** Markdown, rendu sans HTML brut. */
  contenu: string;
  imageChemin: string | null;
  imageUrl: string | null;
  /** null = brouillon. */
  publieLe: string | null;
  misAJourLe: string;
  policeTitre: PoliceTitre;
};

export type ResultatArticle =
  | { ok: true; id?: number }
  | { ok: false; message: string; erreurs?: Partial<Record<string, string>> };

export type StatutCommentaire = "en_attente" | "publie" | "refuse";

export type Commentaire = {
  id: number;
  /** Prénom et initiale, ex. « Awa N. ». */
  auteur: string;
  contenu: string;
  creeLe: string;
};

export type CommentaireAdmin = Commentaire & {
  statut: StatutCommentaire;
  articleTitre: string;
  articleSlug: string;
};

export type ResultatCommentaire = { ok: boolean; message: string };
