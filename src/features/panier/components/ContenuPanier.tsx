"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { VisuelProduit, type Produit } from "@/features/catalogue";
import { formaterPrix, pluriel } from "@/shared/lib/format";
import { ButtonLink, EmptyState, IconButton, SelecteurQuantite } from "@/shared/ui";
import { usePanier } from "../hooks/usePanier";
import { detaillerPanier, QUANTITE_MAX, type LigneDetaillee } from "../lib/panier";

const MESSAGES_PROBLEME = {
  indisponible: "Ce produit n'est plus proposé. Retirez-le pour continuer.",
  epuise: "Ce produit vient d'être épuisé. Retirez-le pour continuer.",
  stock: "Stock insuffisant : réduisez la quantité.",
} as const;

export function ContenuPanier({ produits }: { produits: Produit[] }) {
  const panier = usePanier();

  if (!panier.pret) {
    return <div aria-busy className="h-64 animate-pulse rounded-carte bg-surface-douce" />;
  }

  const { lignes, sousTotal, nombreArticles, commandable } = detaillerPanier(
    panier.lignes,
    produits,
  );

  if (lignes.length === 0) {
    return (
      <EmptyState
        icone={<ShoppingBag className="size-7" strokeWidth={1.5} />}
        titre="Votre panier est vide"
        description="Découvrez nos déodorants, huiles parfumées et savons."
        action={<ButtonLink href="/boutique">Découvrir la boutique</ButtonLink>}
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <ul className="divide-y divide-bordure border-y border-bordure">
        {lignes.map((ligne) => (
          <LignePanierVue
            key={ligne.slug}
            ligne={ligne}
            onChange={(q) => panier.modifier(ligne.slug, q)}
            onRetirer={() => panier.retirer(ligne.slug)}
          />
        ))}
      </ul>

      <aside
        aria-label="Récapitulatif"
        className="flex flex-col gap-4 rounded-carte bg-surface-douce p-6 lg:sticky lg:top-28"
      >
        <h2 className="text-2xl">Récapitulatif</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt>Sous-total ({pluriel(nombreArticles, "article")})</dt>
            <dd className="font-medium">{formaterPrix(sousTotal)}</dd>
          </div>
          <div className="flex justify-between text-texte-attenue">
            <dt>Livraison</dt>
            <dd>Calculée à l&apos;étape suivante</dd>
          </div>
        </dl>
        {commandable ? (
          <ButtonLink href="/commande" taille="lg" className="w-full">
            Passer la commande
          </ButtonLink>
        ) : (
          <p role="status" className="text-sm text-danger">
            Corrigez les produits signalés pour passer la commande.
          </p>
        )}
        <Link href="/boutique" className="text-center text-sm text-primaire hover:underline">
          Continuer mes achats
        </Link>
      </aside>
    </div>
  );
}

type PropsLigne = {
  ligne: LigneDetaillee;
  onChange: (quantite: number) => void;
  onRetirer: () => void;
};

function LignePanierVue({ ligne, onChange, onRetirer }: PropsLigne) {
  const { produit, probleme } = ligne;
  const nom = produit?.nom ?? "Produit indisponible";
  return (
    <li className="flex gap-4 py-5">
      {produit ? (
        <Link href={`/produit/${produit.slug}`} className="w-20 shrink-0 sm:w-24">
          <VisuelProduit produit={produit} sizes="96px" className="rounded-controle" />
        </Link>
      ) : (
        <div
          aria-hidden
          className="aspect-square w-20 shrink-0 rounded-controle bg-surface-douce sm:w-24"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-titre text-xl leading-tight">
              {produit ? (
                <Link href={`/produit/${produit.slug}`} className="hover:text-primaire">
                  {nom}
                </Link>
              ) : (
                nom
              )}
            </p>
            {produit && (
              <p className="text-sm text-texte-attenue">
                {produit.contenance} · {formaterPrix(ligne.prixUnitaire)}
              </p>
            )}
          </div>
          <IconButton
            libelle={`Retirer ${nom} du panier`}
            onClick={onRetirer}
            className="-mt-2 -mr-2"
          >
            <Trash2 aria-hidden className="size-4.5" strokeWidth={1.5} />
          </IconButton>
        </div>
        {probleme && (
          <p role="alert" className="text-sm text-danger">
            {MESSAGES_PROBLEME[probleme]}
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          {produit && probleme !== "epuise" ? (
            <SelecteurQuantite
              taille="sm"
              valeur={ligne.quantite}
              max={Math.min(QUANTITE_MAX, Math.max(produit.stock, 1))}
              onChange={onChange}
              libelle={`Quantité de ${nom}`}
            />
          ) : (
            <span />
          )}
          <p className="font-medium">{probleme ? "—" : formaterPrix(ligne.total)}</p>
        </div>
      </div>
    </li>
  );
}
