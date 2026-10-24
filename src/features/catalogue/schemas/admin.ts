import { z } from "zod";
import { LIBELLES_FAMILLE } from "../lib/produit";
import type { FamilleOlfactive } from "../types";

/*
 * Saisies de l'administration du catalogue, partagées entre le formulaire et
 * les Server Actions (mêmes règles, mêmes messages).
 */

const texteFacultatif = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max} caractères au maximum.`)
    .optional()
    .transform((v) => v || null);

const entier = (message: string) =>
  z.coerce.number({ error: message }).int(message).min(0, message);

const familles = Object.keys(LIBELLES_FAMILLE) as [FamilleOlfactive, ...FamilleOlfactive[]];

/** « Bergamote, Rose » -> ["Bergamote", "Rose"]. */
const listeNotes = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(",")
      .map((note) => note.trim())
      .filter(Boolean)
      .slice(0, 6),
  );

export const produitAdminSchema = z
  .object({
    nom: z.string().trim().min(2, "Le nom est obligatoire.").max(120, "120 caractères au maximum."),
    categorieId: z.coerce
      .number({ error: "Choisissez une catégorie." })
      .int()
      .positive("Choisissez une catégorie."),
    accroche: texteFacultatif(120),
    contenance: texteFacultatif(40),
    prix: entier("Prix en FCFA, nombre entier.").refine((p) => p > 0, "Le prix est obligatoire."),
    prixPromo: z
      .union([z.literal(""), entier("Prix promo en FCFA, nombre entier.")])
      .optional()
      .transform((v) => (v === "" || v === undefined || v === 0 ? null : v)),
    stock: entier("Stock : nombre entier, 0 ou plus."),
    description: texteFacultatif(2000),
    conseilsUtilisation: texteFacultatif(1000),
    composition: texteFacultatif(1000),
    familleOlfactive: z
      .union([z.literal(""), z.enum(familles)])
      .optional()
      .transform((v) => v || null),
    notesTete: listeNotes,
    notesCoeur: listeNotes,
    notesFond: listeNotes,
    estNouveaute: z.boolean(),
    vedette: z.boolean().optional().default(false),
    /** Recalcule l'adresse de la fiche d'après le nom (avant la mise en ligne surtout). */
    majAdresse: z.boolean().optional().default(false),
    actif: z.boolean(),
  })
  // RM-03 : la promotion doit être inférieure au prix.
  .refine((p) => p.prixPromo === null || p.prixPromo < p.prix, {
    path: ["prixPromo"],
    message: "Le prix promo doit être inférieur au prix.",
  });

export type ProduitAdminSaisi = z.input<typeof produitAdminSchema>;
export type ProduitAdminValide = z.output<typeof produitAdminSchema>;

export const categorieAdminSchema = z.object({
  nom: z.string().trim().min(2, "Le nom est obligatoire.").max(60, "60 caractères au maximum."),
  description: texteFacultatif(300),
  ordre: entier("Ordre : nombre entier."),
  active: z.boolean(),
});

export type CategorieAdminSaisie = z.input<typeof categorieAdminSchema>;
export type CategorieAdminValide = z.output<typeof categorieAdminSchema>;
