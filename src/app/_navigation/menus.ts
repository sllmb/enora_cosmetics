/*
 * Source unique des menus : en-tête, tiroir mobile, pied de page et
 * administration en sont dérivés. Ajouter une catégorie ici suffit à
 * l'afficher partout (en attendant qu'elles viennent de la base, Sprint 1).
 */

export type LienMenu = {
  libelle: string;
  href: string;
  exact?: boolean;
  /** Sous-menu dépliable (ex. le catalogue et ses catégories). */
  enfants?: LienMenu[];
  /** Autres chemins qui rendent l'entrée active (ex. les fiches produit). */
  aussi?: string[];
};

export const CATEGORIES_MENU: LienMenu[] = [
  { libelle: "Déodorants", href: "/boutique/deodorants" },
  { libelle: "Huiles parfumées", href: "/boutique/huiles-parfumees" },
  { libelle: "Savons", href: "/boutique/savons" },
];

export const MENU_PRINCIPAL: LienMenu[] = [
  { libelle: "Accueil", href: "/", exact: true },
  {
    libelle: "Catalogue",
    href: "/boutique",
    aussi: ["/produit"],
    enfants: [{ libelle: "Tous les produits", href: "/boutique", exact: true }, ...CATEGORIES_MENU],
  },
  { libelle: "Conseils", href: "/conseils" },
  { libelle: "À propos", href: "/a-propos" },
];

export const MENU_PIED: { titre: string; liens: LienMenu[] }[] = [
  {
    titre: "Boutique",
    liens: [{ libelle: "Tous les produits", href: "/boutique" }, ...CATEGORIES_MENU],
  },
  {
    titre: "Aide",
    liens: [
      { libelle: "Livraison et paiement", href: "/livraison" },
      { libelle: "Contact", href: "/contact" },
      { libelle: "Mon compte", href: "/compte" },
    ],
  },
  {
    titre: "Énora",
    liens: [
      { libelle: "À propos", href: "/a-propos" },
      { libelle: "Conseils", href: "/conseils" },
      { libelle: "Conditions générales de vente", href: "/cgv" },
      { libelle: "Mentions légales", href: "/mentions-legales" },
    ],
  },
];

export const MENU_ADMIN: LienMenu[] = [
  { libelle: "Tableau de bord", href: "/admin", exact: true },
  { libelle: "Commandes", href: "/admin/commandes" },
  { libelle: "Produits", href: "/admin/produits" },
  { libelle: "Catégories", href: "/admin/categories" },
  { libelle: "Livraison", href: "/admin/livraison" },
  { libelle: "Avis", href: "/admin/avis" },
  { libelle: "Conseils", href: "/admin/articles" },
  { libelle: "Commentaires", href: "/admin/commentaires" },
];

export function estActif(lien: LienMenu, chemin: string): boolean {
  const dans = (racine: string) => chemin === racine || chemin.startsWith(`${racine}/`);
  if (lien.exact) return chemin === lien.href;
  return dans(lien.href) || (lien.aussi ?? []).some(dans);
}
