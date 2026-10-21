import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Confirmation de commande" };

export default function Page() {
  return (
    <PageAVenir
      titre="Commande confirmée"
      description="Le récapitulatif de votre commande."
      sprint="Sprint 2 — Panier et commande"
    />
  );
}
