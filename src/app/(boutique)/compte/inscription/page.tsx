import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Inscription" };

export default function Page() {
  return (
    <PageAVenir
      titre="Créer un compte"
      description="Créez votre compte Énora."
      sprint="Sprint 3 — Comptes"
    />
  );
}
