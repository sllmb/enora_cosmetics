"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { pluriel } from "@/shared/lib/format";
import { usePanier } from "../hooks/usePanier";

export function CompteurPanier() {
  const { nombreArticles } = usePanier();
  return (
    <Link
      href="/panier"
      aria-label={nombreArticles > 0 ? `Panier, ${pluriel(nombreArticles, "article")}` : "Panier"}
      className="relative inline-flex size-11 items-center justify-center rounded-full hover:bg-surface-douce"
    >
      <ShoppingBag aria-hidden className="size-5" strokeWidth={1.5} />
      {nombreArticles > 0 && (
        <span
          aria-hidden
          className="absolute top-1 right-0.5 flex h-5 min-w-5 animate-apparition items-center justify-center rounded-full tissu-soie px-1 text-[11px] font-medium text-sur-primaire"
        >
          {nombreArticles > 99 ? "99+" : nombreArticles}
        </span>
      )}
    </Link>
  );
}
