import { z } from "zod";

/*
 * Seul fichier qui lit process.env. Les variables NEXT_PUBLIC_* doivent être
 * écrites en toutes lettres pour que Next.js les injecte dans le navigateur.
 * La validation est paresseuse : une page qui n'utilise pas Supabase fonctionne
 * même si le projet Supabase n'est pas encore configuré.
 */

const publicSchema = z.object({
  siteUrl: z.url().default("http://localhost:3000"),
  whatsappNumero: z
    .string()
    .regex(
      /^\d{8,15}$/,
      "Numéro WhatsApp au format international sans + ni espaces (ex. 221771234567).",
    )
    .optional(),
});

const supabasePublicSchema = z.object({
  url: z.url({ error: "NEXT_PUBLIC_SUPABASE_URL manquante ou invalide." }),
  cleAnon: z.string({ error: "NEXT_PUBLIC_SUPABASE_ANON_KEY manquante." }).min(1),
});

const serveurSchema = z.object({
  cleServiceRole: z.string({ error: "SUPABASE_SERVICE_ROLE_KEY manquante." }).min(1),
});

const vide = (v: string | undefined) => (v === "" ? undefined : v);

export const env = publicSchema.parse({
  siteUrl: vide(process.env.NEXT_PUBLIC_SITE_URL),
  whatsappNumero: vide(process.env.NEXT_PUBLIC_WHATSAPP_NUMERO),
});

export function lireEnvSupabase() {
  return supabasePublicSchema.parse({
    url: vide(process.env.NEXT_PUBLIC_SUPABASE_URL),
    cleAnon: vide(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  });
}

/** Serveur uniquement : appelée depuis un module protégé par `server-only`. */
export function lireEnvServeur() {
  return serveurSchema.parse({ cleServiceRole: vide(process.env.SUPABASE_SERVICE_ROLE_KEY) });
}
