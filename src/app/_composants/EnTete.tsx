"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CompteurPanier } from "@/features/panier";
import { IconButton, Logo } from "@/shared/ui";
import { menuPrincipal, type CategorieMenu } from "../_navigation/menus";
import { ListeLiens } from "./ListeLiens";
import { NavPrincipale } from "./NavPrincipale";

export function EnTete({ categories }: { categories: CategorieMenu[] }) {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const liens = menuPrincipal(categories);

  return (
    <header className="sticky top-0 z-40 border-b border-bordure bg-fond/90 backdrop-blur-md">
      <div className="conteneur flex h-16 items-center justify-between gap-4 lg:h-20">
        <Dialog.Root open={menuOuvert} onOpenChange={setMenuOuvert}>
          <Dialog.Trigger asChild>
            <IconButton libelle="Ouvrir le menu" className="-ml-2 lg:hidden">
              <Menu aria-hidden className="size-6" strokeWidth={1.5} />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-texte/40 data-[state=open]:animate-apparition" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col bg-fond p-6 shadow-flottant data-[state=open]:animate-apparition">
              <div className="flex items-center justify-between">
                <Dialog.Title className="titre-espace text-texte-attenue">Menu</Dialog.Title>
                <Dialog.Close asChild>
                  <IconButton libelle="Fermer le menu" className="-mr-2">
                    <X aria-hidden className="size-6" strokeWidth={1.5} />
                  </IconButton>
                </Dialog.Close>
              </div>
              <Dialog.Description className="sr-only">
                Navigation principale du site
              </Dialog.Description>
              <nav aria-label="Navigation mobile" className="mt-8">
                <ListeLiens
                  liens={liens}
                  onNavigate={() => setMenuOuvert(false)}
                  classeListe="flex flex-col gap-1"
                  classeLien="block rounded-controle py-3 font-titre text-2xl aria-[current=page]:text-primaire"
                  classeSousListe="mb-2 ml-1 flex flex-col border-l border-bordure pl-4"
                  classeSousLien="block py-2 text-base text-texte-attenue aria-[current=page]:font-medium aria-[current=page]:text-primaire"
                />
              </nav>
              <Link
                href="/compte"
                onClick={() => setMenuOuvert(false)}
                className="mt-auto flex items-center gap-3 border-t border-bordure pt-6 text-sm"
              >
                <User aria-hidden className="size-5" strokeWidth={1.5} />
                Mon compte
              </Link>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Link href="/" className="shrink-0" aria-label="Énora Cosmetics, accueil">
          <Logo forme="complet" priority className="w-32 lg:w-40" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <NavPrincipale liens={liens} />
        </nav>

        <div className="-mr-2 flex items-center">
          <Link
            href="/compte"
            aria-label="Mon compte"
            className="hidden size-11 items-center justify-center rounded-full hover:bg-surface-douce sm:inline-flex"
          >
            <User aria-hidden className="size-5" strokeWidth={1.5} />
          </Link>
          <CompteurPanier />
        </div>
      </div>
    </header>
  );
}
