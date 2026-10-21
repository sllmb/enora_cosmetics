import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Livraison" };

export default function Page() {
  return (
    <PageAVenir
      titre="Zones de livraison"
      description="Zones, frais et délais de livraison."
      sprint="Sprint 4 — Administration"
    />
  );
}
