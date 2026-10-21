import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "À propos" };

export default function Page() {
  return (
    <PageAVenir
      titre="À propos d'Énora"
      description="L'histoire et les valeurs de la marque."
      sprint="Sprint 6 — Finitions"
    />
  );
}
