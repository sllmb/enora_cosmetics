import type { Avis, ResumeAvis } from "../types";

/** Note moyenne arrondie au dixième (4,333 -> 4,3) et nombre d'avis. */
export function resumerAvis(avis: Pick<Avis, "note">[]): ResumeAvis {
  if (avis.length === 0) return { moyenne: 0, nombre: 0 };
  const somme = avis.reduce((s, a) => s + a.note, 0);
  return { moyenne: Math.round((somme / avis.length) * 10) / 10, nombre: avis.length };
}

// Partagé avec les commentaires des conseils.
export { nomPublic } from "@/shared/lib/format";

export function formaterNote(moyenne: number): string {
  return moyenne.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
