import type { Metadata } from "next";
import { listerProduits } from "@/features/catalogue/serveur";
import { FormulaireCommande } from "@/features/commande";
import { listerZones } from "@/features/commande/serveur";

export const metadata: Metadata = { title: "Commande", robots: { index: false } };

export default async function CommandePage() {
  const [produits, zones] = await Promise.all([listerProduits(), listerZones()]);
  return (
    <div className="conteneur py-12 sm:py-16">
      <h1 className="mb-10 text-5xl sm:text-6xl">Finaliser la commande</h1>
      <FormulaireCommande produits={produits} zones={zones} />
    </div>
  );
}
