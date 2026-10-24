import { listerCategories, listerProduits } from "@/features/catalogue/serveur";
import { BoutonWhatsApp } from "../_composants/BoutonWhatsApp";
import { EnTete } from "../_composants/EnTete";
import { PiedDePage } from "../_composants/PiedDePage";

export default async function BoutiqueLayout({ children }: LayoutProps<"/">) {
  // Menus : catégories actives qui ont au moins un produit visible (lectures en cache).
  const [categories, produits] = await Promise.all([listerCategories(), listerProduits()]);
  const categoriesMenu = categories.filter((c) => produits.some((p) => p.categorieSlug === c.slug));
  return (
    <>
      <p className="bg-primaire py-2 text-center text-xs tracking-wide text-sur-primaire">
        <span className="sm:hidden">Livraison à Dakar · Paiement à la livraison</span>
        <span className="hidden sm:inline">
          Livraison à Dakar et environs · Paiement à la livraison, Wave ou Orange Money
        </span>
      </p>
      <EnTete categories={categoriesMenu} />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <PiedDePage categories={categoriesMenu} />
      <BoutonWhatsApp />
    </>
  );
}
