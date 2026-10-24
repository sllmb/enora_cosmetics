/*
 * RM-15 : limites contre les commandes en rafale (robots, blocage du stock).
 * Une vraie cliente ne les atteint jamais ; au-delà, elle est invitée à écrire
 * sur WhatsApp.
 */

/** Commandes « en attente » pour un même numéro sur 24 h. */
export const MAX_EN_ATTENTE_PAR_TELEPHONE = 3;
/** Commandes depuis une même connexion sur 1 h. */
export const MAX_PAR_CONNEXION_PAR_HEURE = 5;

export type Compteurs = { enAttenteTelephone: number; recentesConnexion: number };

/** Message d'empêchement, ou null si la commande peut être enregistrée. */
export function motifLimite({ enAttenteTelephone, recentesConnexion }: Compteurs): string | null {
  if (enAttenteTelephone >= MAX_EN_ATTENTE_PAR_TELEPHONE) {
    return "Vous avez déjà plusieurs commandes en attente avec ce numéro. Écrivez-nous sur WhatsApp pour les confirmer ou en passer une nouvelle.";
  }
  if (recentesConnexion >= MAX_PAR_CONNEXION_PAR_HEURE) {
    return "Beaucoup de commandes ont été passées en peu de temps. Réessayez dans une heure ou écrivez-nous sur WhatsApp.";
  }
  return null;
}

/** Première adresse de la chaîne x-forwarded-for (celle de la visiteuse). */
export function adresseVisiteuse(entetes: { get(nom: string): string | null }): string | null {
  const transmise = entetes.get("x-forwarded-for")?.split(",")[0]?.trim();
  return transmise || entetes.get("x-real-ip")?.trim() || null;
}
