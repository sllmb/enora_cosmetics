import type { Metadata } from "next";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { GestionCategories } from "@/features/catalogue/admin";
import { listerCategoriesAdmin } from "@/features/catalogue/serveur";

export const metadata: Metadata = { title: "Catégories" };

export default function CategoriesAdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <EnteteAdmin
        titre="Catégories"
        description="L'ordre définit la position dans le menu et sur l'accueil."
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
  return <GestionCategories categories={await listerCategoriesAdmin()} />;
}
