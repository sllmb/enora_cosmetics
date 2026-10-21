import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Mon compte" };

export default function Page() {
  return (
    <PageAVenir
      titre="Mon compte"
      description="Vos informations et vos commandes."
      sprint="Sprint 3 — Comptes"
    />
  );
}
