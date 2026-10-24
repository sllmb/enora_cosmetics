"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button, SelecteurQuantite } from "@/shared/ui";
import { usePanier } from "../hooks/usePanier";
import { QUANTITE_MAX } from "../lib/panier";

type Props = { produit: { slug: string; nom: string; stock: number } };

export function AjoutPanier({ produit }: Props) {
  const router = useRouter();
  const panier = usePanier();
  const [quantite, setQuantite] = useState(1);

  if (produit.stock <= 0) {
    return (
      <div className="flex flex-col gap-2">
        <Button taille="lg" disabled className="w-full">
          Épuisé
        </Button>
        <p className="text-sm text-texte-attenue">
          Ce produit revient bientôt. Écrivez-nous sur WhatsApp pour être prévenu·e.
        </p>
      </div>
    );
  }

  const ajouter = () => {
    const ajoute = panier.ajouter(produit.slug, quantite, produit.stock);
    const voir = { label: "Voir le panier", onClick: () => router.push("/panier") };
    if (ajoute === 0) {
      toast.info("Quantité maximale déjà dans votre panier", {
        description: `${produit.nom} : ${Math.min(produit.stock, QUANTITE_MAX)} au plus.`,
        action: voir,
      });
    } else {
      toast.success("Ajouté au panier", {
        description:
          ajoute < quantite
            ? `${produit.nom} × ${ajoute} (stock limité)`
            : `${produit.nom} × ${ajoute}`,
        action: voir,
      });
      setQuantite(1);
    }
  };

  return (
    // Toujours sur une ligne, même hauteur : quantité à gauche, bouton qui prend le reste.
    <div className="flex items-stretch gap-3">
      <SelecteurQuantite
        valeur={quantite}
        max={Math.min(QUANTITE_MAX, produit.stock)}
        onChange={setQuantite}
        className="w-32 shrink-0 sm:w-36"
      />
      <Button taille="lg" className="min-w-0 flex-1 px-4 sm:px-8" onClick={ajouter}>
        <ShoppingBag aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
        <span>
          Ajouter<span className="max-[379px]:sr-only"> au panier</span>
        </span>
      </Button>
    </div>
  );
}
