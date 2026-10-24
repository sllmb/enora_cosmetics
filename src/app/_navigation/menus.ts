/*
 * Source unique des menus : en-tête, tiroir mobile, pied de page et
 * administration en sont dérivés. Les catégories viennent de la base (actives
 * et non vides) : en créer, désactiver ou vider une dans l'administration
 * met les menus à jour.
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

export type CategorieMenu = { nom: string; slug: string };

const liensCategories = (categories: CategorieMenu[]): LienMenu[] =>
  categories.map((c) => ({ libelle: c.nom, href: `/boutique/${c.slug}` }));

export function menuPrincipal(categories: CategorieMenu[]): LienMenu[] {
  return [
    { libelle: "Accueil", href: "/", exact: true },
    {
      libelle: "Catalogue",
      href: "/boutique",
      aussi: ["/produit"],
      enfants: [
        { libelle: "Tous les produits", href: "/boutique", exact: true },
        ...liensCategories(categories),
      ],
    },
    { libelle: "Conseils", href: "/conseils" },
    { libelle: "À propos", href: "/a-propos" },
  ];
}

export const menuPied = (categories: CategorieMenu[]): { titre: string; liens: LienMenu[] }[] => [
  {
    titre: "Boutique",
    liens: [{ libelle: "Tous les produits", href: "/boutique" }, ...liensCategories(categories)],
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
