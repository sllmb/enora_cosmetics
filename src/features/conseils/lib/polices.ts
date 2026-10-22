// Polices proposées pour le titre d'un article. Le chargement des fichiers de
// police est dans components/polices.ts (next/font).
export const POLICES_TITRE = ["classique", "princesse", "plume", "parisienne"] as const;
export type PoliceTitre = (typeof POLICES_TITRE)[number];

export const LIBELLES_POLICE: Record<PoliceTitre, { libelle: string; description: string }> = {
  classique: { libelle: "Classique", description: "L'élégance du site" },
  princesse: { libelle: "Princesse", description: "Calligraphie romantique" },
  plume: { libelle: "Plume", description: "Écriture à la plume, très luxe" },
  parisienne: { libelle: "Parisienne", description: "Cursive chic et lisible" },
};

export const estPoliceTitre = (valeur: string): valeur is PoliceTitre =>
  (POLICES_TITRE as readonly string[]).includes(valeur);

/** Les écritures manuscrites paraissent plus petites : on les agrandit. */
export const estManuscrite = (police: PoliceTitre) => police !== "classique";
