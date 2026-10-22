"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Search, ShoppingBag, X } from "lucide-react";
import { useRef, useState } from "react";
import { prixEffectif, type Produit, VisuelProduit } from "@/features/catalogue";
import { formaterPrix } from "@/shared/lib/format";
import { IconButton } from "@/shared/ui";

type Props = { produits: Produit[]; onChoisir: (slug: string) => void };

const normaliser = (texte: string) => texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Fenêtre de choix d'un produit à présenter dans l'article. */
export function SelecteurProduit({ produits, onChoisir }: Props) {
  const [ouvert, setOuvert] = useState(false);
  const [recherche, setRecherche] = useState("");
  // Produit choisi, inséré une fois la fenêtre fermée : le curseur doit d'abord
  // revenir dans le texte, sinon l'insertion échappe à l'historique Ctrl+Z.
  const choix = useRef<string | null>(null);
  const filtres = produits.filter((p) =>
    normaliser(`${p.nom} ${p.accroche}`).includes(normaliser(recherche.trim())),
  );

  return (
    <Dialog.Root
      open={ouvert}
      onOpenChange={(o) => {
        setOuvert(o);
        if (!o) setRecherche("");
      }}
    >
      <Dialog.Trigger asChild>
        <IconButton
          libelle="Présenter un produit"
          className="size-9 rounded-controle"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ShoppingBag aria-hidden className="size-4" />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-texte/40 data-[state=open]:animate-apparition" />
        <Dialog.Content
          onCloseAutoFocus={(e) => {
            // Au retour, le curseur revient dans le texte (et non sur le bouton).
            e.preventDefault();
            const slug = choix.current;
            choix.current = null;
            if (slug) onChoisir(slug);
          }}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[min(40rem,calc(100dvh-2rem))] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-carte bg-surface p-6 shadow-flottant"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-titre text-2xl">Présenter un produit</Dialog.Title>
              <Dialog.Description className="text-sm text-texte-attenue">
                Sa carte, avec le bouton « Voir en boutique », s&apos;insère à la position du
                curseur.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <IconButton libelle="Fermer" className="-mt-2 -mr-2">
                <X aria-hidden className="size-5" />
              </IconButton>
            </Dialog.Close>
          </div>
          <label className="relative block">
            <span className="sr-only">Rechercher un produit</span>
            <Search
              aria-hidden
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-texte-attenue"
            />
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un produit…"
              className="h-11 w-full rounded-controle border border-bordure-forte bg-surface pr-4 pl-9 text-base focus-visible:border-primaire"
            />
          </label>
          <ul className="-mx-2 flex min-h-0 flex-col overflow-y-auto">
            {filtres.length === 0 && (
              <li className="px-2 py-6 text-center text-sm text-texte-attenue">
                Aucun produit visible dans la boutique ne correspond.
              </li>
            )}
            {filtres.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => {
                    choix.current = p.slug;
                    setOuvert(false);
                    setRecherche("");
                  }}
                  className="flex w-full items-center gap-3 rounded-controle px-2 py-2 text-left hover:bg-surface-douce focus-visible:bg-surface-douce"
                >
                  <VisuelProduit
                    produit={p}
                    sizes="3.5rem"
                    className="size-14 shrink-0 rounded-controle"
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{p.nom}</span>
                    <span className="truncate text-sm text-texte-attenue">{p.accroche}</span>
                  </span>
                  <span className="shrink-0 text-sm">{formaterPrix(prixEffectif(p))}</span>
                </button>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
