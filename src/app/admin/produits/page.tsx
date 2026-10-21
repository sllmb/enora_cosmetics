import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Produits" };

export default function Page() {
  return (
    <PageAVenir
      titre="Produits"
      description="Catalogue, stock, prix et promotions."
      sprint="Sprint 4 — Administration"
    />
  );
}
