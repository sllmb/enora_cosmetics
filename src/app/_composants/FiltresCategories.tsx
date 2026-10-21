import type { Categorie } from "@/features/catalogue";
import { ListeLiens } from "./ListeLiens";

/** Pastilles de navigation entre catégories (la catégorie courante est marquée). */
export function FiltresCategories({ categories }: { categories: Categorie[] }) {
  const liens = [
    { libelle: "Tout", href: "/boutique", exact: true },
    ...categories.map((c) => ({ libelle: c.nom, href: `/boutique/${c.slug}` })),
  ];
  return (
    <nav aria-label="Catégories" className="my-10">
      <ListeLiens
        liens={liens}
        classeListe="flex flex-wrap justify-center gap-2"
        classeLien="inline-flex h-10 items-center rounded-full border border-bordure px-5 text-sm whitespace-nowrap transition-colors duration-150 hover:border-primaire aria-[current=page]:border-primaire aria-[current=page]:bg-primaire aria-[current=page]:text-sur-primaire"
      />
    </nav>
  );
}
