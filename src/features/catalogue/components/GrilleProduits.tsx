import { PackageOpen } from "lucide-react";
import { ButtonLink, EmptyState } from "@/shared/ui";
import type { Produit } from "../types";
import { CarteProduit } from "./CarteProduit";

export function GrilleProduits({ produits }: { produits: Produit[] }) {
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
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {produits.map((produit) => (
        <li key={produit.slug}>
          <CarteProduit produit={produit} />
        </li>
      ))}
    </ul>
  );
}
