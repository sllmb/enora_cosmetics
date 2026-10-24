import { MENU_ADMIN } from "../_navigation/menus";
import { ListeLiens } from "./ListeLiens";

type Props = {
  /** Éléments en attente par entrée du menu (clé : son adresse). */
  compteurs?: Partial<Record<string, number>>;
};

export function NavAdmin({ compteurs = {} }: Props) {
  const liens = MENU_ADMIN.map((lien) => ({ ...lien, compteur: compteurs[lien.href] }));
  return (
    // Mobile : toutes les entrées visibles sur quelques lignes (pas de défilement caché).
    <nav aria-label="Administration" className="px-3 pb-3">
      <ListeLiens
        liens={liens}
        classeListe="flex flex-wrap gap-1.5 lg:flex-col lg:flex-nowrap lg:gap-1"
        classeLien="flex items-center rounded-full border border-bordure px-3 py-1.5 text-sm whitespace-nowrap hover:bg-surface-douce aria-[current=page]:border-primaire-doux aria-[current=page]:bg-primaire-doux aria-[current=page]:font-medium aria-[current=page]:text-primaire lg:rounded-controle lg:border-transparent lg:py-2"
      />
    </nav>
  );
}
