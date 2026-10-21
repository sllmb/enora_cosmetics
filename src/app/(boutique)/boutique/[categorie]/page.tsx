import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FiltresCategories } from "@/app/_composants/FiltresCategories";
import { CatalogueFiltrable } from "@/features/catalogue";
import { lireCategorie, listerCategories, listerProduits } from "@/features/catalogue/serveur";

export async function generateStaticParams() {
  const categories = await listerCategories();
  return categories.map((c) => ({ categorie: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/boutique/[categorie]">): Promise<Metadata> {
  const categorie = await lireCategorie((await params).categorie);
  if (!categorie) return {};
  return {
    title: categorie.nom,
    description: categorie.description,
    alternates: { canonical: `/boutique/${categorie.slug}` },
  };
}

// L'adresse n'est lue que sous Suspense (navigation instantanée, voir la fiche produit).
export default function CategoriePage({ params }: PageProps<"/boutique/[categorie]">) {
  return (
    <Suspense fallback={<div aria-busy className="conteneur h-96 animate-pulse py-12 sm:py-16" />}>
      <ContenuCategorie params={params} />
    </Suspense>
  );
}

async function ContenuCategorie({ params }: Pick<PageProps<"/boutique/[categorie]">, "params">) {
  const { categorie: slug } = await params;
  const [categorie, categories, produits] = await Promise.all([
    lireCategorie(slug),
    listerCategories(),
    listerProduits({ categorieSlug: slug }),
  ]);
  if (!categorie) notFound();

  return (
    <div className="conteneur py-12 sm:py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <p className="titre-espace text-texte-attenue">Boutique</p>
        <h1 className="text-5xl sm:text-6xl">{categorie.nom}</h1>
        <p className="max-w-lg text-texte-attenue">{categorie.description}</p>
      </header>
      <FiltresCategories categories={categories} />
      <CatalogueFiltrable produits={produits} />
    </div>
  );
}
