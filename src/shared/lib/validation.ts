import { z } from "zod";

/*
 * Règles de saisie communes, écrites une seule fois et réutilisées par les
 * schémas des formulaires ET par les Server Actions (mêmes messages des deux côtés).
 */

/** Numéros sénégalais : mobiles 70/75/76/77/78, fixes 33. Accepte +221 / 00221 et espaces. */
export function normaliserTelephoneSn(saisie: string): string | null {
  const chiffres = saisie.replace(/[\s.\-()]/g, "").replace(/^(\+|00)221/, "");
  return /^(7[05678]|33)\d{7}$/.test(chiffres) ? chiffres : null;
}

export const telephoneSn = z
  .string()
  .trim()
  .min(1, "Le numéro de téléphone est obligatoire.")
  .transform((valeur, ctx) => {
    const normalise = normaliserTelephoneSn(valeur);
    if (!normalise) {
      ctx.addIssue({ code: "custom", message: "Numéro sénégalais invalide (ex. 77 123 45 67)." });
      return z.NEVER;
    }
    return normalise;
  });

export const nomComplet = z
  .string()
  .trim()
  .min(2, "Le nom doit contenir au moins 2 caractères.")
  .max(80, "Le nom ne doit pas dépasser 80 caractères.");

export const email = z.email("Adresse email invalide.").trim().toLowerCase();

export const motDePasse = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .regex(/[A-Za-z]/, "Le mot de passe doit contenir au moins une lettre.")
  .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre.");
