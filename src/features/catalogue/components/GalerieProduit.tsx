"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import type { Produit } from "../types";
import { VisuelProduit } from "./VisuelProduit";

type Props = {
  produit: Pick<Produit, "nom" | "forme" | "familleOlfactive" | "images">;
  className?: string;
};

/**
 * Fiche produit : grande photo, puis vignettes cliquables quand il y en a
 * plusieurs (flèches sur la grande photo, et flèches du clavier).
 */
export function GalerieProduit({ produit, className }: Props) {
  const [index, setIndex] = useState(0);
  const total = produit.images.length;
  const aller = (i: number) => setIndex((i + total) % total);

  if (total <= 1) {
    return (
      <VisuelProduit
        produit={produit}
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        className={className}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        role="group"
        aria-roledescription="galerie"
        aria-label={`Photos de ${produit.nom}`}
        className="group relative"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") aller(index - 1);
          if (e.key === "ArrowRight") aller(index + 1);
        }}
      >
        <VisuelProduit
          produit={produit}
          indexPhoto={index}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={className}
        />
        <p aria-live="polite" className="sr-only">
          Photo {index + 1} sur {total}
        </p>
        {[
          { libelle: "Photo précédente", Icone: ChevronLeft, cible: index - 1, place: "left-3" },
          { libelle: "Photo suivante", Icone: ChevronRight, cible: index + 1, place: "right-3" },
        ].map(({ libelle, Icone, cible, place }) => (
          <button
            key={libelle}
            type="button"
            aria-label={libelle}
            onClick={() => aller(cible)}
            className={cn(
              "absolute top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-texte shadow-carte backdrop-blur-sm transition-opacity hover:bg-surface",
              "sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
              place,
            )}
          >
            <Icone aria-hidden className="size-5" />
          </button>
        ))}
      </div>
      <ul className="grid grid-cols-5 gap-2">
        {produit.images.map((image, i) => (
          <li key={image.url}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir la photo ${i + 1} sur ${total}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative block aspect-square w-full overflow-hidden rounded-controle border-2 bg-surface-douce transition-colors",
                i === index ? "border-primaire" : "border-transparent hover:border-bordure-forte",
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="96px"
                className="object-contain p-[8%] mix-blend-multiply"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
