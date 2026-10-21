/**
 * Adresse de retour après connexion (?suite=…). Seuls les chemins internes sont
 * acceptés : « //site.com » ou « https://… » renverraient vers un autre site.
 */
export function cheminDeRetour(valeur: string | null | undefined, parDefaut = "/compte"): string {
  if (!valeur || !valeur.startsWith("/") || valeur.startsWith("//") || valeur.includes("\\")) {
    return parDefaut;
  }
  return valeur;
}
