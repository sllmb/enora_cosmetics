"use client";

import * as Menu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/shared/lib/cn";
import { estActif, MENU_PRINCIPAL, type LienMenu } from "../_navigation/menus";

const CLASSE_LIEN = cn(
  "relative inline-flex items-center gap-1 py-2 text-sm tracking-wide transition-colors duration-220 hover:text-primaire",
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primaire after:transition-transform after:duration-220",
  "aria-[current=page]:text-primaire aria-[current=page]:after:scale-x-100",
  "data-[actif=true]:text-primaire data-[actif=true]:after:scale-x-100",
);

/** Entrée avec sous-menu (le catalogue) : un bouton qui déplie la liste des catégories. */
function SousMenu({ lien, chemin }: { lien: LienMenu; chemin: string | null }) {
  const actif = Boolean(chemin && estActif(lien, chemin));
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        className={cn(
          CLASSE_LIEN,
          "group outline-none focus-visible:outline-2 focus-visible:outline-primaire",
        )}
        data-actif={actif}
      >
        {lien.libelle}
        <ChevronDown
          aria-hidden
          className="size-4 transition-transform duration-220 group-data-[state=open]:rotate-180"
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          align="start"
          sideOffset={10}
          className="z-50 min-w-56 rounded-carte border border-bordure bg-surface p-2 shadow-flottant data-[state=open]:animate-apparition"
        >
          {lien.enfants?.map((enfant) => (
            <Menu.Item key={enfant.href} asChild>
              <Link
                href={enfant.href}
                aria-current={chemin && estActif(enfant, chemin) ? "page" : undefined}
                className="block rounded-controle px-4 py-2.5 text-sm outline-none aria-[current=page]:font-medium aria-[current=page]:text-primaire data-[highlighted]:bg-surface-douce"
              >
                {enfant.libelle}
              </Link>
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}

function Nav({ chemin }: { chemin: string | null }) {
  return (
    <ul className="flex items-center gap-8">
      {MENU_PRINCIPAL.map((lien) => (
        <li key={lien.libelle}>
          {lien.enfants ? (
            <SousMenu lien={lien} chemin={chemin} />
          ) : (
            <Link
              href={lien.href}
              aria-current={chemin && estActif(lien, chemin) ? "page" : undefined}
              className={CLASSE_LIEN}
            >
              {lien.libelle}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

function NavActive() {
  return <Nav chemin={usePathname()} />;
}

/** Navigation de l'en-tête (grands écrans). Même principe que ListeLiens pour la page courante. */
export function NavPrincipale() {
  return (
    <Suspense fallback={<Nav chemin={null} />}>
      <NavActive />
    </Suspense>
  );
}
