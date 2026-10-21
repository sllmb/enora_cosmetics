import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Mes commandes" };

export default function Page() {
  return (
    <PageAVenir
      titre="Mes commandes"
      description="L'historique de vos commandes."
      sprint="Sprint 3 — Comptes"
    />
  );
}
