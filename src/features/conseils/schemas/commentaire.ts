import { z } from "zod";

export const commentaireSchema = z.object({
  contenu: z
    .string()
    .trim()
    .min(2, "Écrivez votre commentaire.")
    .max(1000, "1000 caractères au maximum."),
});
