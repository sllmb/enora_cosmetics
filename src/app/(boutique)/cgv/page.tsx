import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function Page() {
  return <PageAVenir titre="Conditions générales de vente" sprint="Sprint 6 — Finitions" />;
}
