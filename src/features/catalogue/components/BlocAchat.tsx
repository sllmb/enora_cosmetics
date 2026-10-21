"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, IconButton } from "@/shared/ui";

// RM-05 : 1 à 20 par ligne, sans dépasser le stock (revérifié côté serveur au Sprint 2).
const QUANTITE_MAX = 20;

type Props = { nom: string; stock: number };

export function BlocAchat({ nom, stock }: Props) {
  const [quantite, setQuantite] = useState(1);
  const maximum = Math.min(QUANTITE_MAX, stock);

  if (stock <= 0) {
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

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div
        role="group"
        aria-label="Quantité"
        className="flex h-13 items-center justify-between rounded-full border border-bordure-forte px-1 sm:w-36"
      >
        <IconButton
          libelle="Diminuer la quantité"
          disabled={quantite <= 1}
          onClick={() => setQuantite((q) => q - 1)}
          className="disabled:opacity-40"
        >
          <Minus aria-hidden className="size-4" />
        </IconButton>
        <output aria-live="polite" className="min-w-6 text-center font-medium">
          {quantite}
        </output>
        <IconButton
          libelle="Augmenter la quantité"
          disabled={quantite >= maximum}
          onClick={() => setQuantite((q) => q + 1)}
          className="disabled:opacity-40"
        >
          <Plus aria-hidden className="size-4" />
        </IconButton>
      </div>
      <Button
        taille="lg"
        className="flex-1"
        onClick={() =>
          toast.info("Le panier arrive très bientôt", {
            description: `${nom} × ${quantite} — la commande en ligne ouvre au Sprint 2.`,
          })
        }
      >
        <ShoppingBag aria-hidden className="size-5" strokeWidth={1.5} />
        Ajouter au panier
      </Button>
    </div>
  );
}
