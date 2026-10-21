import { MENU_ADMIN } from "../_navigation/menus";
import { ListeLiens } from "./ListeLiens";

export function NavAdmin() {
  return (
    <nav aria-label="Administration" className="overflow-x-auto px-3 pb-3">
      <ListeLiens
        liens={MENU_ADMIN}
        classeListe="flex gap-1 lg:flex-col"
        classeLien="block rounded-controle px-3 py-2 text-sm whitespace-nowrap hover:bg-surface-douce aria-[current=page]:bg-primaire-doux aria-[current=page]:font-medium aria-[current=page]:text-primaire"
      />
    </nav>
  );
}
