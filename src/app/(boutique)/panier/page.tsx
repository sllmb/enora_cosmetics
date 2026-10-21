import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Panier" };

export default function Page() {
  return (
    <PageAVenir
      titre="Votre panier"
      description="Retrouvez ici les produits que vous avez choisis."
      sprint="Sprint 2 — Panier et commande"
    />
  );
}
