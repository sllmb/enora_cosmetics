import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Mentions légales" };

export default function Page() {
  return <PageAVenir titre="Mentions légales" sprint="Sprint 6 — Finitions" />;
}
