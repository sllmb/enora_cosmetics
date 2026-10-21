import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Commandes" };

export default function Page() {
  return (
    <PageAVenir
      titre="Commandes"
      description="Suivi et changement de statut des commandes."
      sprint="Sprint 4 — Administration"
    />
  );
}
