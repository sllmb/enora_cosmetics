import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Catégorie" };

export default function Page() {
  return (
    <PageAVenir
      titre="Catégorie"
      description="Les produits de cette catégorie."
      sprint="Sprint 1 — Catalogue"
    />
  );
}
