import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Avis" };

export default function Page() {
  return (
    <PageAVenir
      titre="Avis clients"
      description="Modération des avis."
      sprint="Sprint 5 — Avis et conseils"
    />
  );
}
