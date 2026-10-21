import type { Metadata } from "next";
import { GrilleProduits, listerCategories, listerProduits } from "@/features/catalogue";
import { FiltresCategories } from "@/app/_composants/FiltresCategories";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Déodorants, huiles parfumées et savons Énora, livrés partout au Sénégal.",
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
      <FiltresCategories categories={categories} />
      <GrilleProduits produits={produits} />
    </div>
  );
}
