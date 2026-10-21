import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Livraison et paiement" };

export default function Page() {
  return (
    <PageAVenir
      titre="Livraison et paiement"
      description="Zones, délais, frais de livraison et moyens de paiement."
      sprint="Sprint 2 — Panier et commande"
    />
  );
}
