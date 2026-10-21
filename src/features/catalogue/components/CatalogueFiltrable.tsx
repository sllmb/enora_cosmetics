"use client";

import { SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { pluriel } from "@/shared/lib/format";
import { Button, EmptyState } from "@/shared/ui";
import {
  appliquerSelection,
  ecrireSelection,
  famillesDisponibles,
  lireSelection,
  SELECTION_PAR_DEFAUT,
  type Selection,
} from "../lib/filtres";
import type { Produit } from "../types";
import { BarreFiltres } from "./BarreFiltres";
import { GrilleProduits } from "./GrilleProduits";

type Props = { produits: Produit[] };

/**
 * Grille avec tri et filtres. Les choix vivent dans l'URL, connue seulement
 * dans le navigateur : la version par défaut sert de rendu pré-calculé
 * (Cache Components), puis la sélection de l'URL s'applique.
 */
export function CatalogueFiltrable({ produits }: Props) {
  return (
    <Suspense fallback={<Vue produits={produits} selection={SELECTION_PAR_DEFAUT} />}>
      <VueSelonUrl produits={produits} />
    </Suspense>
  );
}

function VueSelonUrl({ produits }: Props) {
  const params = useSearchParams();
  const chemin = usePathname();
  const router = useRouter();
  return (
    <Vue
      produits={produits}
      selection={lireSelection(params)}
      changer={(selection) =>
        router.replace(`${chemin}${ecrireSelection(selection)}`, { scroll: false })
      }
    />
  );
}

function Vue({
  produits,
  selection,
  changer,
}: Props & { selection: Selection; changer?: (selection: Selection) => void }) {
  const visibles = appliquerSelection(produits, selection);
  const filtrage = produits.length > 0 && visibles.length === 0;
  return (
    <div className="flex flex-col gap-8">
      {produits.length > 0 && (
        <BarreFiltres
          selection={selection}
          familles={famillesDisponibles(produits)}
          nombre={pluriel(visibles.length, "produit")}
          changer={changer}
        />
      )}
      {filtrage ? (
        <EmptyState
          icone={<SearchX className="size-7" strokeWidth={1.5} />}
          titre="Aucun produit ne correspond"
          description="Essayez une autre famille olfactive ou affichez aussi les produits épuisés."
          action={
            <Button variante="secondaire" onClick={() => changer?.(SELECTION_PAR_DEFAUT)}>
              Réinitialiser les filtres
            </Button>
          }
        />
      ) : (
        <GrilleProduits produits={visibles} />
      )}
    </div>
  );
}
