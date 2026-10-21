import type { Metadata } from "next";
import { PageAVenir } from "@/app/_composants/PageAVenir";

export const metadata: Metadata = { title: "Conseil" };

export default function Page() {
  return (
    <PageAVenir
      titre="Article"
      description="Un article de conseils."
      sprint="Sprint 5 — Avis et conseils"
    />
  );
}
