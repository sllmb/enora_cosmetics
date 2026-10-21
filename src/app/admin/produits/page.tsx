import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { ListeProduitsAdmin } from "@/features/catalogue/admin";
import { listerProduitsAdmin } from "@/features/catalogue/serveur";
import { ButtonLink } from "@/shared/ui";

export const metadata: Metadata = { title: "Produits" };

export default function ProduitsAdminPage() {
  return (
    <div className="px-4 py-8 sm:px-8">
      <EnteteAdmin
        titre="Produits"
        description="Les produits masqués n'apparaissent pas dans la boutique."
        action={
          <ButtonLink href="/admin/produits/nouveau">
            <Plus aria-hidden className="size-4" /> Nouveau produit
          </ButtonLink>
        }
      />
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Liste />
      </Suspense>
    </div>
  );
}

async function Liste() {
  return <ListeProduitsAdmin produits={await listerProduitsAdmin()} />;
}
