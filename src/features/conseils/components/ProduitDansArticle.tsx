import { ShoppingBag } from "lucide-react";
import { BadgesProduit, type Produit, VisuelProduit } from "@/features/catalogue";
import { ButtonLink, Prix } from "@/shared/ui";

/** Carte d'un produit glissée dans un article, avec un lien vers sa fiche. */
export function ProduitDansArticle({ produit }: { produit: Produit }) {
  return (
    <aside
      aria-label={`Produit : ${produit.nom}`}
      className="my-10 grid items-center gap-5 overflow-hidden rounded-carte border border-bordure bg-surface p-4 shadow-carte sm:grid-cols-[12rem_1fr] sm:p-5"
    >
      <div className="relative">
        <VisuelProduit
          produit={produit}
          sizes="(max-width: 640px) 100vw, 12rem"
          className="rounded-controle"
        />
        <div className="absolute top-2 left-2">
          <BadgesProduit produit={produit} />
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <p className="titre-espace text-xs text-texte-attenue">Le produit</p>
        <p className="font-titre text-2xl leading-tight text-texte">{produit.nom}</p>
        {produit.accroche && <p className="text-base text-texte-attenue">{produit.accroche}</p>}
        <div className="flex items-baseline gap-2 text-base">
          <Prix prix={produit.prix} prixPromo={produit.prixPromo} />
          <span className="text-sm text-texte-attenue">{produit.contenance}</span>
        </div>
        <ButtonLink href={`/produit/${produit.slug}`} className="mt-2">
          <ShoppingBag aria-hidden className="size-4" /> Voir en boutique
        </ButtonLink>
      </div>
    </aside>
  );
}
