import { z } from "zod";

export const avisSchema = z.object({
  note: z.coerce
    .number({ error: "Choisissez une note de 1 à 5 étoiles." })
    .int("Choisissez une note de 1 à 5 étoiles.")
    .min(1, "Choisissez une note de 1 à 5 étoiles.")
    .max(5, "Choisissez une note de 1 à 5 étoiles."),
  commentaire: z
    .string()
    .trim()
    .max(1000, "1000 caractères au maximum.")
    .optional()
    .transform((v) => v || null),
});

export type AvisSaisi = z.input<typeof avisSchema>;
