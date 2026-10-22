import { ChevronRight, PackageOpen } from "lucide-react";
import Link from "next/link";
import { formaterPrix } from "@/shared/lib/format";
import { Badge, EmptyState } from "@/shared/ui";
import type { ProduitAdmin } from "../../queries/admin";
import { VisuelProduit } from "../VisuelProduit";

export function ListeProduitsAdmin({ produits }: { produits: ProduitAdmin[] }) {
  if (produits.length === 0) {
    return (
      <EmptyState
        icone={<PackageOpen className="size-7" strokeWidth={1.5} />}
        titre="Aucun produit"
        description="Créez votre premier produit."
      />
    );
  }
  return (
    <ul className="divide-y divide-bordure rounded-carte border border-bordure bg-surface">
      {produits.map((produit) => (
        <li key={produit.id}>
          <Link
            href={`/admin/produits/${produit.id}`}
            className="flex items-center gap-4 px-4 py-3 hover:bg-surface-douce/60 sm:px-6"
          >
            <VisuelProduit
              produit={produit}
              sizes="56px"
              className="w-14 shrink-0 rounded-controle"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="flex flex-wrap items-center gap-2">
                <span className="truncate font-medium">{produit.nom}</span>
                {!produit.actif && <Badge>Masqué</Badge>}
                {produit.estNouveaute && <Badge ton="doux">Nouveau</Badge>}
              </p>
              <p className="text-sm text-texte-attenue">
                {produit.categorieNom} · {formaterPrix(produit.prixPromo ?? produit.prix)}
                {produit.prixPromo !== null && " (promo)"}
              </p>
            </div>
            <Badge
              ton={produit.stock === 0 ? "danger" : produit.stock <= 5 ? "avertissement" : "neutre"}
            >
              {produit.stock === 0 ? "Épuisé" : `Stock ${produit.stock}`}
            </Badge>
            <ChevronRight aria-hidden className="size-4 shrink-0 text-texte-attenue" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
