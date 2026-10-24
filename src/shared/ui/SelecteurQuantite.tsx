import { Minus, Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { IconButton } from "./IconButton";

type Props = {
  valeur: number;
  min?: number;
  max: number;
  onChange: (valeur: number) => void;
  /** Précise le produit pour les lecteurs d'écran, ex. « Quantité de Savon Ambre noir ». */
  libelle?: string;
  taille?: "sm" | "md";
  className?: string;
};

export function SelecteurQuantite({
  valeur,
  min = 1,
  max,
  onChange,
  libelle = "Quantité",
  taille = "md",
  className,
}: Props) {
  return (
    <div
      role="group"
      aria-label={libelle}
      className={cn(
        "flex items-center justify-between rounded-full border border-bordure-forte px-1",
        taille === "md" ? "h-13 w-36" : "h-10 w-28",
        className,
      )}
    >
      <IconButton
        libelle="Diminuer la quantité"
        disabled={valeur <= min}
        onClick={() => onChange(valeur - 1)}
        className={cn("disabled:opacity-40", taille === "sm" && "size-8")}
      >
        <Minus aria-hidden className="size-4" />
      </IconButton>
      <output aria-live="polite" className="min-w-6 text-center font-medium">
        {valeur}
      </output>
      <IconButton
        libelle="Augmenter la quantité"
        disabled={valeur >= max}
        onClick={() => onChange(valeur + 1)}
        className={cn("disabled:opacity-40", taille === "sm" && "size-8")}
      >
        <Plus aria-hidden className="size-4" />
      </IconButton>
    </div>
  );
}
