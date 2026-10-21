import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Boutique" };

export default function Page() {
  return (
    <PageAVenir
      titre="Boutique"
      description="Tous nos produits d'hygiène corporelle."
      sprint="Sprint 1 — Catalogue"
    />
  );
}
