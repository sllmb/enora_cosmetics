import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { FormulaireProduit } from "@/features/catalogue/admin";
import { listerCategoriesAdmin } from "@/features/catalogue/serveur";

export const metadata: Metadata = { title: "Nouveau produit" };

export default function NouveauProduitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <EnteteAdmin
        titre="Nouveau produit"
        description="Les photos s'ajoutent juste après la création."
        retour={
          <Link
            href="/admin/produits"
            className="inline-flex items-center gap-1 text-sm text-texte-attenue hover:text-primaire"
          >
            <ArrowLeft aria-hidden className="size-4" /> Produits
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
  return <FormulaireProduit categories={await listerCategoriesAdmin()} />;
}
