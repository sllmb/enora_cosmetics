import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Articles" };

export default function Page() {
  return (
    <PageAVenir
      titre="Articles"
      description="Rédaction des conseils."
      sprint="Sprint 5 — Avis et conseils"
    />
  );
}
