import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Conseils" };

export default function Page() {
  return (
    <PageAVenir
      titre="Conseils"
      description="Nos conseils pour une hygiène corporelle au quotidien."
      sprint="Sprint 5 — Avis et conseils"
    />
  );
}
