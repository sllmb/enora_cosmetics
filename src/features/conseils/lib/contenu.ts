/*
 * Contenu enrichi des articles, en plus du Markdown :
 * - images insérées dans le texte : ![description](image:fichier.webp "légende"),
 *   un code court qui désigne une image du stockage du site (articles/contenu) ;
 * - cartes produit : une ligne seule « [[produit:slug-du-produit]] ».
 */

export const DOSSIER_IMAGES_CONTENU = "articles/contenu/";

const LIGNE_PRODUIT = /^[ \t]*\[\[produit:([a-z0-9-]+)\]\][ \t]*$/gm;

export type Bloc = { type: "texte"; texte: string } | { type: "produit"; slug: string };

/** Découpe le texte autour des cartes produit, dans l'ordre. */
export function decouperContenu(contenu: string): Bloc[] {
  const blocs: Bloc[] = [];
  let position = 0;
  for (const correspondance of contenu.matchAll(LIGNE_PRODUIT)) {
    const texte = contenu.slice(position, correspondance.index);
    if (texte.trim()) blocs.push({ type: "texte", texte });
    blocs.push({ type: "produit", slug: correspondance[1] ?? "" });
    position = correspondance.index + correspondance[0].length;
  }
  const reste = contenu.slice(position);
  if (reste.trim()) blocs.push({ type: "texte", texte: reste });
  return blocs;
}

/** Produits cités dans l'article, sans doublon. */
export function slugsProduits(contenu: string): string[] {
  return [...new Set([...contenu.matchAll(LIGNE_PRODUIT)].map((c) => c[1] ?? ""))];
}

/** Ligne à insérer pour afficher la carte d'un produit. */
export const ligneProduit = (slug: string) => `[[produit:${slug}]]`;

/** Début d'adresse publique des images du texte. */
export const prefixeImages = (urlSupabase: string) =>
  `${urlSupabase.replace(/\/+$/, "")}/storage/v1/object/public/produits/${DOSSIER_IMAGES_CONTENU}`;

// Dans le texte, une image envoyée s'écrit avec un code court : image:<fichier>.webp.
const REFERENCE_IMAGE = /^image:([\w-]+\.webp)$/;

/** Chemin de stockage d'une image du texte, ou null si ce n'est pas une image du site. */
export function cheminImage(reference: string): string | null {
  const fichier = REFERENCE_IMAGE.exec(reference)?.[1];
  return fichier ? `${DOSSIER_IMAGES_CONTENU}${fichier}` : null;
}

/** Adresse publique d'une image du texte, ou null si elle ne vient pas du site. */
export function urlImage(reference: string, urlSupabase: string): string | null {
  const fichier = REFERENCE_IMAGE.exec(reference)?.[1];
  return fichier ? `${prefixeImages(urlSupabase)}${fichier}` : null;
}

/** Chemins de stockage de toutes les images du texte. */
export function imagesDuContenu(contenu: string): string[] {
  const chemins = [...contenu.matchAll(/!\[[^\]]*\]\(\s*<?([^\s)>]+)>?/g)]
    .map((c) => cheminImage(c[1] ?? ""))
    .filter((c): c is string => c !== null);
  return [...new Set(chemins)];
}

/** Bloc Markdown d'une image envoyée, la description étant à compléter. */
export const blocImage = (fichier: string, description = "Description de l'image") =>
  `![${description}](image:${fichier})`;
