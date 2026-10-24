import { z } from "zod";
import { POLICES_TITRE } from "./polices";

/*
 * Brouillon d'article gardé dans le navigateur (localStorage) pendant la saisie :
 * un rechargement de la page ou un onglet fermé ne fait plus perdre le texte.
 * Effacé dès que l'article est enregistré.
 */

const brouillonSchema = z.object({
  le: z.number(),
  valeurs: z.object({
    titre: z.string(),
    extrait: z.string().optional(),
    contenu: z.string(),
    publie: z.boolean(),
    policeTitre: z.enum(POLICES_TITRE),
  }),
});

export type Brouillon = z.infer<typeof brouillonSchema>;
export type ValeursBrouillon = Brouillon["valeurs"];

export const cleBrouillon = (articleId: number | null) =>
  `enora:brouillon-article:${articleId ?? "nouveau"}`;

// L'accès au stockage peut échouer (navigation privée, stockage plein) : jamais bloquant.
export function lireBrouillon(cle: string): Brouillon | null {
  try {
    const brut = window.localStorage.getItem(cle);
    if (!brut) return null;
    const lu = brouillonSchema.safeParse(JSON.parse(brut));
    return lu.success ? lu.data : null;
  } catch {
    return null;
  }
}

export function ecrireBrouillon(cle: string, valeurs: ValeursBrouillon, le = Date.now()) {
  try {
    window.localStorage.setItem(cle, JSON.stringify({ le, valeurs } satisfies Brouillon));
  } catch {
    // Sans stockage, la saisie continue normalement.
  }
}

export function effacerBrouillon(cle: string) {
  try {
    window.localStorage.removeItem(cle);
  } catch {
    // Rien à faire.
  }
}

/** Le brouillon apporte-t-il quelque chose par rapport à ce qui est déjà enregistré ? */
export function brouillonDiffere(brouillon: ValeursBrouillon, enregistre: ValeursBrouillon) {
  return (Object.keys(enregistre) as (keyof ValeursBrouillon)[]).some(
    (champ) => (brouillon[champ] ?? "") !== (enregistre[champ] ?? ""),
  );
}
