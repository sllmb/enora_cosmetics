import type { Categorie } from "@/features/catalogue";
import { ListeLiens } from "./ListeLiens";

/**
 * Pastilles de navigation entre catégories (la catégorie courante est marquée).
 * Mobile : une rangée qui défile au doigt ; grands écrans : centrées sur plusieurs lignes.
 */
export function FiltresCategories({ categories }: { categories: Categorie[] }) {
  const liens = [
    { libelle: "Tout", href: "/boutique", exact: true },
    ...categories.map((c) => ({ libelle: c.nom, href: `/boutique/${c.slug}` })),
  ];
  return (
    <nav aria-label="Catégories" className="-mx-4 my-5 sm:mx-0 sm:my-10">
      <ListeLiens
        liens={liens}
        classeListe="flex gap-2 overflow-x-auto px-4 pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0"
        classeLien="inline-flex h-10 shrink-0 items-center rounded-full border border-bordure px-5 text-sm whitespace-nowrap transition-colors duration-150 hover:border-primaire aria-[current=page]:border-primaire aria-[current=page]:tissu-soie aria-[current=page]:text-sur-primaire"
      />
    </nav>
  );
}
