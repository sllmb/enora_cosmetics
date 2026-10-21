import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Produit" };

export default function Page() {
  return (
    <PageAVenir
      titre="Fiche produit"
      description="Le détail d'un produit."
      sprint="Sprint 1 — Catalogue"
    />
  );
}
