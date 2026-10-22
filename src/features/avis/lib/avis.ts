import type { Avis, ResumeAvis } from "../types";

/** Note moyenne arrondie au dixième (4,333 -> 4,3) et nombre d'avis. */
export function resumerAvis(avis: Pick<Avis, "note">[]): ResumeAvis {
  if (avis.length === 0) return { moyenne: 0, nombre: 0 };
  const somme = avis.reduce((s, a) => s + a.note, 0);
  return { moyenne: Math.round((somme / avis.length) * 10) / 10, nombre: avis.length };
}

/**
 * Nom affiché publiquement : prénom et initiale du nom (« Awa Ndiaye » ->
 * « Awa N. »). Les clientes ne sont jamais exposées en entier.
 */
export function nomPublic(nomComplet: string): string {
  const [prenom, ...reste] = nomComplet.trim().split(/\s+/).filter(Boolean);
  if (!prenom) return "Cliente Énora";
  const initiale = reste.at(-1)?.[0];
  return initiale ? `${prenom} ${initiale.toUpperCase()}.` : prenom;
}

export function formaterNote(moyenne: number): string {
  return moyenne.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
