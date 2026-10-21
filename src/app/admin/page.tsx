import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Tableau de bord" };

export default function Page() {
  return (
    <PageAVenir
      titre="Tableau de bord"
      description="Vue d'ensemble des ventes et des commandes."
      sprint="Sprint 4 — Administration"
    />
  );
}
