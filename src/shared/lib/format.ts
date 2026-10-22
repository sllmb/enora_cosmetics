const formateurFcfa = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** 12500 -> « 12 500 FCFA » (espace insécable fine entre milliers, comme fr-FR). */
export function formaterPrix(montant: number): string {
  return `${formateurFcfa.format(Math.round(montant))}\u00a0FCFA`;
}

const formateurDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Dakar",
});

export function formaterDate(date: Date | string): string {
  return formateurDate.format(typeof date === "string" ? new Date(date) : date);
}

/** pluriel(2, "article") -> « 2 articles ». */
export function pluriel(nombre: number, singulier: string, plurielForme = `${singulier}s`): string {
  return `${nombre}\u00a0${nombre > 1 ? plurielForme : singulier}`;
}

/** « Huile parfumée Ambre » -> « huile-parfumee-ambre ». */
export function slugifier(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
