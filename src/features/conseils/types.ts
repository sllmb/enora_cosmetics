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
};

export type ResultatArticle =
  | { ok: true; id?: number }
  | { ok: false; message: string; erreurs?: Partial<Record<string, string>> };
