import { z } from "zod";
import { normaliserTelephoneSn } from "@/shared/lib/validation";

/*
 * Seul fichier qui lit process.env. Les variables NEXT_PUBLIC_* doivent être
 * écrites en toutes lettres pour que Next.js les injecte dans le navigateur.
 * La validation est paresseuse : une page qui n'utilise pas Supabase fonctionne
 * même si le projet Supabase n'est pas encore configuré.
 */

type Source = Record<string, string | undefined>;

const vide = (v: string | undefined) => (v === undefined || v.trim() === "" ? undefined : v.trim());

/**
 * Réglages publics facultatifs : une valeur mal saisie est ignorée (avec un
 * avertissement dans le terminal) au lieu de rendre tout le site inaccessible.
 */
export function lireEnvPublic(source: Source) {
  const avertir = (variable: string, attendu: string) =>
    console.warn(`[env] ${variable} ignorée : ${attendu}`);

  const siteUrl = vide(source.NEXT_PUBLIC_SITE_URL);
  const urlValide = siteUrl !== undefined && z.url().safeParse(siteUrl).success;
  if (siteUrl && !urlValide)
    avertir("NEXT_PUBLIC_SITE_URL", "adresse attendue, ex. https://enora.sn");

  const whatsapp = vide(source.NEXT_PUBLIC_WHATSAPP_NUMERO)?.replace(/[\s+]/g, "");
  const whatsappValide = whatsapp !== undefined && /^\d{8,15}$/.test(whatsapp);
  if (whatsapp && !whatsappValide) {
    avertir("NEXT_PUBLIC_WHATSAPP_NUMERO", "numéro international, ex. 221771234567");
  }

  /** Numéro marchand sénégalais : accepte « 77 123 45 67 » ou « +221771234567 ». */
  const numeroMarchand = (variable: string) => {
    const brut = vide(source[variable]);
    if (!brut) return undefined;
    const numero = normaliserTelephoneSn(brut);
    if (!numero) avertir(variable, "numéro sénégalais, ex. 77 123 45 67");
    return numero ?? undefined;
  };

  return {
    siteUrl: (urlValide ? siteUrl : "http://localhost:3000").replace(/\/+$/, ""),
    whatsappNumero: whatsappValide ? whatsapp : undefined,
    waveNumero: numeroMarchand("NEXT_PUBLIC_WAVE_NUMERO"),
    orangeMoneyNumero: numeroMarchand("NEXT_PUBLIC_ORANGE_MONEY_NUMERO"),
  };
}

export const env = lireEnvPublic({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_WHATSAPP_NUMERO: process.env.NEXT_PUBLIC_WHATSAPP_NUMERO,
  NEXT_PUBLIC_WAVE_NUMERO: process.env.NEXT_PUBLIC_WAVE_NUMERO,
  NEXT_PUBLIC_ORANGE_MONEY_NUMERO: process.env.NEXT_PUBLIC_ORANGE_MONEY_NUMERO,
});

const supabasePublicSchema = z.object({
  url: z.url({ error: "NEXT_PUBLIC_SUPABASE_URL manquante ou invalide." }),
  cleAnon: z.string({ error: "NEXT_PUBLIC_SUPABASE_ANON_KEY manquante." }).min(1),
});

const serveurSchema = z.object({
  cleServiceRole: z.string({ error: "SUPABASE_SERVICE_ROLE_KEY manquante." }).min(1),
});

/** Faux tant que les clés Supabase ne sont pas renseignées (CI, nouvelle installation). */
export function supabaseEstConfiguree(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

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
