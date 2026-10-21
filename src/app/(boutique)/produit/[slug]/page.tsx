import { MessageCircle, Truck, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgesProduit,
  BlocAchat,
  DetailsProduit,
  estEpuise,
  GrilleProduits,
  LIBELLES_FAMILLE,
  lireCategorie,
  lireProduit,
  listerProduits,
  listerProduitsSimilaires,
  NotesOlfactives,
  prixEffectif,
  VisuelProduit,
} from "@/features/catalogue";
import { env } from "@/shared/config/env";
import { Prix } from "@/shared/ui";

export async function generateStaticParams() {
  const produits = await listerProduits();
  return produits.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const produit = await lireProduit((await params).slug);
  return produit
    ? { title: produit.nom, description: `${produit.accroche}. ${produit.description}` }
    : {};
}

const REASSURANCE = [
  { Icone: Truck, texte: "Livraison en 24 h à Dakar, 2 à 5 jours en régions" },
  { Icone: Wallet, texte: "Paiement à la livraison, Wave ou Orange Money" },
  { Icone: MessageCircle, texte: "Une question ? Écrivez-nous sur WhatsApp" },
];

export default async function ProduitPage({ params }: PageProps<"/produit/[slug]">) {
  const produit = await lireProduit((await params).slug);
  if (!produit) notFound();
  const [categorie, similaires] = await Promise.all([
    lireCategorie(produit.categorieSlug),
    listerProduitsSimilaires(produit),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produit.nom,
    description: produit.description,
    brand: { "@type": "Brand", name: "Énora Cosmetics" },
    offers: {
      "@type": "Offer",
      price: prixEffectif(produit),
      priceCurrency: "XOF",
      availability: estEpuise(produit)
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: `${env.siteUrl}/produit/${produit.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Données structurées pour Google ; « < » échappé pour empêcher toute injection.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="conteneur py-8 sm:py-12">
        <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-texte-attenue">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/boutique" className="hover:text-primaire">
                Boutique
              </Link>
            </li>
            {categorie && (
              <li className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link href={`/boutique/${categorie.slug}`} className="hover:text-primaire">
                  {categorie.nom}
                </Link>
              </li>
            )}
            <li className="flex items-center gap-2">
              <span aria-hidden>/</span>
              <span aria-current="page" className="text-texte">
                {produit.nom}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          <div className="relative md:sticky md:top-28 md:self-start">
            <VisuelProduit
              produit={produit}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-carte"
            />
            <div className="absolute top-4 left-4">
              <BadgesProduit produit={produit} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="titre-espace text-texte-attenue">
                {categorie?.nom}
                {produit.familleOlfactive && ` · ${LIBELLES_FAMILLE[produit.familleOlfactive]}`}
              </p>
              <h1 className="text-4xl leading-tight sm:text-5xl">{produit.nom}</h1>
              <p className="text-lg text-texte-attenue">{produit.accroche}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <Prix prix={produit.prix} prixPromo={produit.prixPromo} className="text-2xl" />
              <span className="text-sm text-texte-attenue">{produit.contenance}</span>
            </div>

            {!estEpuise(produit) && produit.stock <= 5 && (
              <p className="text-sm font-medium text-avertissement">
                Plus que {produit.stock} en stock
              </p>
            )}

            <BlocAchat nom={produit.nom} stock={produit.stock} />

            <ul className="flex flex-col gap-3 rounded-carte border border-bordure p-5 text-sm">
              {REASSURANCE.map(({ Icone, texte }) => (
                <li key={texte} className="flex items-center gap-3">
                  <Icone aria-hidden className="size-5 shrink-0 text-primaire" strokeWidth={1.5} />
                  {texte}
                </li>
              ))}
            </ul>

            {produit.notesOlfactives && <NotesOlfactives notes={produit.notesOlfactives} />}

            <DetailsProduit produit={produit} />
          </div>
        </div>

        <section aria-labelledby="similaires" className="mt-24">
          <h2 id="similaires" className="mb-10 text-center text-4xl">
            Vous aimerez aussi
          </h2>
          <GrilleProduits produits={similaires} />
        </section>
      </div>
    </>
  );
}
