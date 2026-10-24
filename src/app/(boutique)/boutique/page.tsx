import type { Metadata } from "next";
import { FiltresCategories } from "@/app/_composants/FiltresCategories";
import { CatalogueFiltrable } from "@/features/catalogue";
import { listerCategories, listerProduits } from "@/features/catalogue/serveur";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Déodorants, huiles parfumées et savons Énora, livrés à Dakar et environs.",
  alternates: { canonical: "/boutique" },
};

export default async function BoutiquePage() {
  const [categories, produits] = await Promise.all([listerCategories(), listerProduits()]);
  return (
    <div className="conteneur py-12 sm:py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <p className="titre-espace text-texte-attenue">Hygiène corporelle</p>
        <h1 className="text-5xl sm:text-6xl">Boutique</h1>
        <p className="max-w-lg text-texte-attenue">
          Tous nos produits pour prendre soin de vous, de la douche au dernier sillage.
        </p>
      </header>
      <FiltresCategories
        categories={categories.filter((c) => produits.some((p) => p.categorieSlug === c.slug))}
      />
      <CatalogueFiltrable produits={produits} />
    </div>
  );
}
