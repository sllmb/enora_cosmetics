import { z } from "zod";
import { email, nomComplet, telephoneSn } from "@/shared/lib/validation";

/*
 * Schémas partagés par le formulaire (navigateur) et la Server Action
 * (serveur) : mêmes règles, mêmes messages des deux côtés.
 */

export const MODES_PAIEMENT = {
  livraison: {
    libelle: "Paiement à la livraison",
    aide: "En espèces ou par mobile money, au livreur.",
  },
  wave: { libelle: "Wave", aide: "Vous recevez le numéro et la référence à indiquer." },
  orange_money: {
    libelle: "Orange Money",
    aide: "Vous recevez le numéro et la référence à indiquer.",
  },
  whatsapp: {
    libelle: "Finaliser sur WhatsApp",
    aide: "Nous confirmons la commande et le paiement ensemble sur WhatsApp.",
  },
} as const;

export type ModePaiement = keyof typeof MODES_PAIEMENT;

const modes = Object.keys(MODES_PAIEMENT) as [ModePaiement, ...ModePaiement[]];

export const coordonneesSchema = z.object({
  nom: nomComplet,
  telephone: telephoneSn,
  email: z.union([z.literal(""), email]).optional(),
  adresse: z
    .string()
    .trim()
    .min(5, "Précisez l'adresse de livraison (quartier, rue, point de repère).")
    .max(300, "L'adresse ne doit pas dépasser 300 caractères."),
  zoneId: z.coerce
    .number({ error: "Choisissez une zone de livraison." })
    .int()
    .positive("Choisissez une zone de livraison."),
  modePaiement: z.enum(modes, { error: "Choisissez un mode de paiement." }),
  note: z.string().trim().max(500, "La note ne doit pas dépasser 500 caractères.").optional(),
  /** Champ invisible : seul un robot le remplit. */
  siteWeb: z.string().optional(),
});

export type CoordonneesSaisies = z.input<typeof coordonneesSchema>;
export type Coordonnees = z.output<typeof coordonneesSchema>;

export const lignesCommandeSchema = z
  .array(z.object({ slug: z.string().min(1), quantite: z.number().int().min(1).max(20) }))
  .min(1, "Votre panier est vide.")
  .max(50);

/** Zone de livraison saisie dans l'administration. */
export const zoneAdminSchema = z.object({
  nom: z.string().trim().min(2, "Le nom est obligatoire.").max(80, "80 caractères au maximum."),
  frais: z.coerce
    .number({ error: "Frais en FCFA, nombre entier." })
    .int("Frais en FCFA, nombre entier.")
    .min(0, "Les frais ne peuvent pas être négatifs."),
  delai: z.string().trim().min(1, "Indiquez un délai.").max(40, "40 caractères au maximum."),
  ordre: z.coerce.number({ error: "Ordre : nombre entier." }).int("Ordre : nombre entier."),
  active: z.boolean(),
});

export type ZoneAdminSaisie = z.input<typeof zoneAdminSchema>;
