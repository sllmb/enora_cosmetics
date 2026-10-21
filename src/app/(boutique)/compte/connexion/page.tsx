import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Connexion" };

export default function Page() {
  return (
    <PageAVenir
      titre="Connexion"
      description="Connectez-vous pour suivre vos commandes."
      sprint="Sprint 3 — Comptes"
    />
  );
}
