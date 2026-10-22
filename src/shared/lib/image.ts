"use client";

/**
 * Réduit une photo dans le navigateur avant l'envoi (côté le plus long :
 * 1600 px, format WebP). Une photo de téléphone de plusieurs Mo passe à
 * quelques centaines de Ko : envoi plus rapide, boutique plus légère.
 */
export async function compresserImage(fichier: File, cote = 1600, qualite = 0.85): Promise<Blob> {
  const image = await createImageBitmap(fichier);
  const echelle = Math.min(1, cote / Math.max(image.width, image.height));
  const largeur = Math.round(image.width * echelle);
  const hauteur = Math.round(image.height * echelle);
  const toile = document.createElement("canvas");
  toile.width = largeur;
  toile.height = hauteur;
  const contexte = toile.getContext("2d");
  if (!contexte) throw new Error("Traitement de l'image impossible dans ce navigateur.");
  contexte.drawImage(image, 0, 0, largeur, hauteur);
  image.close();
  return new Promise((resoudre, rejeter) =>
    toile.toBlob(
      (blob) => (blob ? resoudre(blob) : rejeter(new Error("Conversion de l'image impossible."))),
      "image/webp",
      qualite,
    ),
  );
}
