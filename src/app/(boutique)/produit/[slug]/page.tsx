import { MessageCircle, Truck, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OPEN_GRAPH_BASE } from "@/app/_seo";
import {
  BadgesProduit,
  DetailsProduit,
  estEpuise,
  GrilleProduits,
  LIBELLES_FAMILLE,
  NotesOlfactives,
  prixEffectif,
  VisuelProduit,
} from "@/features/catalogue";
import {
  lireCategorie,
  lireProduit,
  listerProduits,
  listerProduitsSimilaires,
} from "@/features/catalogue/serveur";
import { FormulaireAvis, ListeAvis, resumerAvis } from "@/features/avis";
import { lireDroitAvis, listerAvisProduit } from "@/features/avis/serveur";
import { AjoutPanier } from "@/features/panier";
import { env } from "@/shared/config/env";
import { JsonLd, Prix } from "@/shared/ui";

export async function generateStaticParams() {
  const produits = await listerProduits();
  return produits.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const produit = await lireProduit((await params).slug);
  if (!produit) return {};
  const description = [produit.accroche, produit.description].filter(Boolean).join(". ");
  const photo = produit.images[0];
  return {
    title: produit.nom,
    description,
    alternates: { canonical: `/produit/${produit.slug}` },
    openGraph: {
      ...OPEN_GRAPH_BASE,
      title: produit.nom,
      description,
      url: `/produit/${produit.slug}`,
      images: photo ? [{ url: photo.url, alt: photo.alt }] : OPEN_GRAPH_BASE.images,
    },
  };
}

const REASSURANCE = [
  { Icone: Truck, texte: "Livraison en 24 h à Dakar, 2 à 5 jours en régions" },
  { Icone: Wallet, texte: "Paiement à la livraison, Wave ou Orange Money" },
  { Icone: MessageCircle, texte: "Une question ? Écrivez-nous sur WhatsApp" },
];

// L'adresse (slug) n'est lue que sous Suspense : la structure de la page s'affiche
// tout de suite pendant la navigation, le produit arrive juste après.
export default function ProduitPage({ params }: PageProps<"/produit/[slug]">) {
  return (
    <Suspense fallback={<SqueletteProduit />}>
      <ContenuProduit params={params} />
    </Suspense>
  );
}

function SqueletteProduit() {
  return (
    <div aria-busy className="conteneur grid gap-10 py-8 sm:py-12 md:grid-cols-2 lg:gap-16">
      <div className="aspect-square animate-pulse rounded-carte bg-surface-douce" />
      <div className="flex flex-col gap-4 pt-8">
        <div className="h-4 w-40 animate-pulse rounded-full bg-surface-douce" />
        <div className="h-12 w-3/4 animate-pulse rounded-controle bg-surface-douce" />
        <div className="h-8 w-32 animate-pulse rounded-controle bg-surface-douce" />
      </div>
    </div>
  );
}

async function ContenuProduit({ params }: Pick<PageProps<"/produit/[slug]">, "params">) {
  const produit = await lireProduit((await params).slug);
  if (!produit) notFound();
  const [categorie, similaires, avis] = await Promise.all([
    lireCategorie(produit.categorieSlug),
    listerProduitsSimilaires(produit),
    listerAvisProduit(produit.id),
  ]);
  const resume = resumerAvis(avis);

  const urlProduit = `${env.siteUrl}/produit/${produit.slug}`;
  const jsonLdProduit = {
    "@type": "Product",
    name: produit.nom,
    description: produit.description,
    sku: produit.slug,
    ...(produit.images.length > 0 && { image: produit.images.map((i) => i.url) }),
    brand: { "@type": "Brand", name: "Énora Cosmetics" },
    ...(resume.nombre > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: resume.moyenne,
        reviewCount: resume.nombre,
      },
    }),
    offers: {
      "@type": "Offer",
      price: prixEffectif(produit),
      priceCurrency: "XOF",
      availability: estEpuise(produit)
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: urlProduit,
    },
  };
  const jsonLdFilAriane = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Boutique", url: `${env.siteUrl}/boutique` },
      ...(categorie
        ? [{ name: categorie.nom, url: `${env.siteUrl}/boutique/${categorie.slug}` }]
        : []),
      { name: produit.nom, url: urlProduit },
    ].map((etape, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: etape.name,
      item: etape.url,
    })),
  };

  return (
    <>
      <JsonLd donnees={jsonLdProduit} />
      <JsonLd donnees={jsonLdFilAriane} />
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

            <AjoutPanier produit={{ slug: produit.slug, nom: produit.nom, stock: produit.stock }} />

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

        <section aria-labelledby="avis" className="mt-20 grid gap-10 lg:grid-cols-[1fr_24rem]">
          <div>
            <h2 id="avis" className="mb-6 text-4xl">
              Avis clientes
            </h2>
            <ListeAvis avis={avis} />
          </div>
          {/* Lit la session de la cliente : chargé à part, le reste de la page reste pré-calculé. */}
          <Suspense fallback={null}>
            <DepotAvis produitId={produit.id} slug={produit.slug} />
          </Suspense>
        </section>

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

async function DepotAvis({ produitId, slug }: { produitId: number; slug: string }) {
  const droit = await lireDroitAvis(produitId);
  return <FormulaireAvis produitId={produitId} droit={droit} cheminProduit={`/produit/${slug}`} />;
}
