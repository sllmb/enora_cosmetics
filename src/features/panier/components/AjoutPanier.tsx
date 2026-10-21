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
    <div className="flex flex-col gap-3 sm:flex-row">
      <SelecteurQuantite
        valeur={quantite}
        max={Math.min(QUANTITE_MAX, produit.stock)}
        onChange={setQuantite}
        className="w-full sm:w-36"
      />
      <Button taille="lg" className="flex-1" onClick={ajouter}>
        <ShoppingBag aria-hidden className="size-5" strokeWidth={1.5} />
        Ajouter au panier
      </Button>
    </div>
  );
}
