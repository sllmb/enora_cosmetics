import { PackageOpen } from "lucide-react";
import { ButtonLink, EmptyState } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import type { Produit } from "../types";
import { CarteProduit } from "./CarteProduit";

type Props = {
  produits: Produit[];
  /** Mobile : une rangée à faire glisser au lieu de la grille (accueil). */
  defilantMobile?: boolean;
  /** Nom de la liste pour les lecteurs d'écran. */
  libelle?: string;
};

export function GrilleProduits({ produits, defilantMobile = false, libelle }: Props) {
  if (produits.length === 0) {
    return (
      <EmptyState
        icone={<PackageOpen className="size-7" strokeWidth={1.5} />}
        titre="Aucun produit pour le moment"
        description="De nouveaux produits arrivent bientôt dans cette collection."
        action={
          <ButtonLink href="/boutique" variante="secondaire">
            Voir toute la boutique
          </ButtonLink>
        }
      />
    );
  }
  return (
    <ul
      aria-label={libelle}
      className={cn(
        defilantMobile
          ? "-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0"
          : "grid grid-cols-2 gap-x-4 gap-y-10",
        "md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6",
      )}
    >
      {produits.map((produit) => (
        <li
          key={produit.slug}
          className={cn(defilantMobile && "w-[44%] shrink-0 snap-start sm:w-auto")}
        >
          <CarteProduit produit={produit} />
        </li>
      ))}
    </ul>
  );
}
