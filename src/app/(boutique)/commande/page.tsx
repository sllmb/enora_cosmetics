import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Commande" };

export default function Page() {
  return (
    <PageAVenir
      titre="Finaliser la commande"
      description="Coordonnées, livraison et mode de paiement."
      sprint="Sprint 2 — Panier et commande"
    />
  );
}
