import Link from "next/link";
import { Prix } from "@/shared/ui";
import type { Produit } from "../types";
import { BadgesProduit } from "./BadgesProduit";
import { VisuelProduit } from "./VisuelProduit";

export function CarteProduit({ produit }: { produit: Produit }) {
  return (
    <article className="group relative flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-carte">
        <VisuelProduit
          produit={produit}
          className="transition-transform duration-280 ease-douce group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3">
          <BadgesProduit produit={produit} />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-xl leading-tight sm:text-2xl">
          <Link
            href={`/produit/${produit.slug}`}
            className="after:absolute after:inset-0 hover:text-primaire"
          >
            {produit.nom}
          </Link>
        </h3>
        <p className="text-sm text-texte-attenue">{produit.accroche}</p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-2">
          <Prix prix={produit.prix} prixPromo={produit.prixPromo} />
          <span className="text-xs whitespace-nowrap text-texte-attenue">{produit.contenance}</span>
        </div>
      </div>
    </article>
  );
}
