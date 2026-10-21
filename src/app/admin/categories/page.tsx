import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Catégories" };

export default function Page() {
  return (
    <PageAVenir
      titre="Catégories"
      description="Organisation du catalogue."
      sprint="Sprint 4 — Administration"
    />
  );
}
