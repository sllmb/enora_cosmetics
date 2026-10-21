import type { Metadata } from "next";
import { listerProduits } from "@/features/catalogue/serveur";
import { ContenuPanier } from "@/features/panier";

export const metadata: Metadata = { title: "Panier", robots: { index: false } };

export default async function PanierPage() {
  const produits = await listerProduits();
  return (
    <div className="conteneur py-12 sm:py-16">
      <h1 className="mb-10 text-5xl sm:text-6xl">Votre panier</h1>
      <ContenuPanier produits={produits} />
    </div>
  );
}
