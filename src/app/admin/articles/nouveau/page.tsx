import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { listerProduits } from "@/features/catalogue/serveur";
import { exigerAdmin } from "@/features/compte/serveur";
import { FormulaireArticle } from "@/features/conseils/admin";

export const metadata: Metadata = { title: "Nouvel article" };

export default function NouvelArticlePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <EnteteAdmin
        titre="Nouvel article"
        description="L'image de couverture s'ajoute juste après la création."
        retour={
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-1 text-sm text-texte-attenue hover:text-primaire"
          >
            <ArrowLeft aria-hidden className="size-4" /> Conseils
          </Link>
        }
      />
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Formulaire />
      </Suspense>
    </div>
  );
}

async function Formulaire() {
  const [, produits] = await Promise.all([exigerAdmin(), listerProduits()]);
  return <FormulaireArticle produits={produits} />;
}
