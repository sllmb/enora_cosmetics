import { z } from "zod";
import { email, motDePasse, nomComplet, telephoneSn } from "@/shared/lib/validation";

export const connexionSchema = z.object({
  email,
  motDePasse: z.string().min(1, "Saisissez votre mot de passe."),
});

export const inscriptionSchema = z
  .object({
    nom: nomComplet,
    email,
    motDePasse,
    confirmation: z.string(),
  })
  .refine((v) => v.motDePasse === v.confirmation, {
    path: ["confirmation"],
    message: "Les deux mots de passe ne correspondent pas.",
  });

export const motDePasseOublieSchema = z.object({ email });

export const nouveauMotDePasseSchema = z
  .object({ motDePasse, confirmation: z.string() })
  .refine((v) => v.motDePasse === v.confirmation, {
    path: ["confirmation"],
    message: "Les deux mots de passe ne correspondent pas.",
  });

export const profilSchema = z.object({
  nom: nomComplet,
  telephone: z.union([z.literal(""), telephoneSn]).optional(),
  adresse: z.string().trim().max(300, "L'adresse ne doit pas dépasser 300 caractères.").optional(),
  zoneId: z.union([z.literal(""), z.coerce.number().int().positive()]).optional(),
});

export type ConnexionSaisie = z.input<typeof connexionSchema>;
export type InscriptionSaisie = z.input<typeof inscriptionSchema>;
export type MotDePasseOublieSaisie = z.input<typeof motDePasseOublieSchema>;
export type NouveauMotDePasseSaisie = z.input<typeof nouveauMotDePasseSchema>;
export type ProfilSaisi = z.input<typeof profilSchema>;
