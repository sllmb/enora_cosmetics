import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <PageAVenir
      titre="Contact"
      description="Écrivez-nous ou contactez-nous sur WhatsApp."
      sprint="Sprint 6 — Finitions"
    />
  );
}
