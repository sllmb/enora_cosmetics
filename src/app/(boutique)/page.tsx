import { MessageCircle, Truck, Wallet } from "lucide-react";
import Link from "next/link";
import {
  choisirVedette,
  choisirVisuelsAccueil,
  GrilleProduits,
  VisuelProduit,
} from "@/features/catalogue";
import { listerCategories, listerNouveautes, listerProduits } from "@/features/catalogue/serveur";
import { CarteArticle, CLASSES_POLICE } from "@/features/conseils";
import { cn } from "@/shared/lib/cn";
import { listerArticles } from "@/features/conseils/serveur";
import type { Metadata } from "next";
import { env } from "@/shared/config/env";
import { ButtonLink, JsonLd } from "@/shared/ui";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const JSON_LD_BOUTIQUE = {
  "@type": "OnlineStore",
  name: "Énora Cosmetics",
  url: env.siteUrl,
  logo: `${env.siteUrl}/icon.png`,
  description: "Déodorants, huiles parfumées et savons : l'hygiène corporelle raffinée.",
  areaServed: { "@type": "City", name: "Dakar" },
  currenciesAccepted: "XOF",
  paymentAccepted: "Espèces à la livraison, Wave, Orange Money",
  ...(env.whatsappNumero && { telephone: `+${env.whatsappNumero}` }),
};

const ENGAGEMENTS = [
  { Icone: Truck, titre: "Livraison à Dakar et environs", texte: "En 24 h à Dakar." },
  { Icone: Wallet, titre: "Paiement à la livraison", texte: "Ou par Wave et Orange Money." },
  { Icone: MessageCircle, titre: "Commande sur WhatsApp", texte: "Un conseil, une question ?" },
];

const POSITIONS_HERO = [
  "absolute top-[4%] left-[28%] w-[44%] bg-transparent",
  "absolute top-[36%] left-[0%] w-[42%] bg-transparent",
  "absolute top-[40%] right-[0%] w-[46%] bg-transparent",
];

export default async function AccueilPage() {
  const [articles, categories, nouveautes, produits] = await Promise.all([
    listerArticles(),
    listerCategories(),
    listerNouveautes(4),
    listerProduits(),
  ]);
  // Choisis dans le catalogue : la vedette désignée dans l'administration, puis les nouveautés.
  const vedette = choisirVedette(produits);
  const visuelsHero = choisirVisuelsAccueil(produits, 3);
  // « Nos univers » : la photo d'un produit de chaque catégorie (sinon son illustration).
  const univers = categories.filter((c) => produits.some((p) => p.categorieSlug === c.slug));
  const visuelUnivers = (slug: string) =>
    choisirVisuelsAccueil(
      produits.filter((p) => p.categorieSlug === slug && p.images.length),
      1,
    )[0];

  return (
    <>
      <JsonLd donnees={JSON_LD_BOUTIQUE} />
      <section className="overflow-hidden bg-surface-douce">
        <div className="conteneur grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
          <div className="flex animate-apparition flex-col items-start gap-6">
            <p className="titre-espace text-primaire">Hygiène corporelle</p>
            <h1 className="text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Le soin du corps, <em className="text-primaire">en toute élégance</em>
            </h1>
            <p className="max-w-md text-lg text-texte-attenue">
              Déodorants, huiles parfumées et savons sélectionnés pour vous accompagner chaque jour,
              de la douche au dernier sillage.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/boutique" taille="lg">
                Découvrir la boutique
              </ButtonLink>
              <ButtonLink href="/conseils" taille="lg" variante="secondaire">
                Nos conseils
              </ButtonLink>
            </div>
          </div>
          <div aria-hidden className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-[8%] rounded-full bg-surface-poudre" />
            {visuelsHero.map((produit, i) => (
              <VisuelProduit
                key={produit.slug}
                produit={produit}
                priority
                className={POSITIONS_HERO[i]}
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Nos engagements" className="border-b border-bordure">
        <ul className="conteneur grid gap-6 py-8 sm:grid-cols-3">
          {ENGAGEMENTS.map(({ Icone, titre, texte }) => (
            <li key={titre} className="flex items-center gap-4">
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primaire-doux text-primaire"
              >
                <Icone className="size-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-sm font-medium">{titre}</p>
                <p className="text-sm text-texte-attenue">{texte}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="univers" className="conteneur py-20">
        <p className="text-center titre-espace text-texte-attenue">Nos univers</p>
        <h2 id="univers" className="mt-3 text-center text-4xl sm:text-5xl">
          Prendre soin de soi, simplement
        </h2>
        {/* Mobile : une rangée qui défile au doigt (la carte suivante dépasse pour l'indiquer).
            Grands écrans : grille. */}
        <ul
          aria-label="Nos univers"
          className={cn(
            "-mx-4 mt-12 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3",
            "sm:mx-auto sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0",
            univers.length === 2 ? "sm:max-w-4xl sm:grid-cols-2" : "sm:grid-cols-3",
          )}
        >
          {univers.map((categorie) => (
            <li
              key={categorie.slug}
              className="w-[78%] max-w-80 shrink-0 snap-start sm:w-auto sm:max-w-none"
            >
              <Link
                href={`/boutique/${categorie.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-carte border border-bordure bg-surface shadow-carte"
              >
                <VisuelProduit
                  produit={
                    visuelUnivers(categorie.slug) ?? {
                      nom: categorie.nom,
                      forme: categorie.forme,
                      familleOlfactive: null,
                      images: [],
                    }
                  }
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="transition-transform duration-280 ease-douce group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="text-3xl">{categorie.nom}</h3>
                  <p className="text-texte-attenue">{categorie.description}</p>
                  <span className="mt-auto pt-2 text-sm font-medium text-primaire group-hover:underline">
                    Voir les produits
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="nouveautes" className="conteneur pb-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="titre-espace text-texte-attenue">Tout juste arrivés</p>
            <h2 id="nouveautes" className="mt-3 text-4xl sm:text-5xl">
              Nouveautés
            </h2>
          </div>
          <Link href="/boutique" className="text-sm font-medium text-primaire hover:underline">
            Tout voir
          </Link>
        </div>
        <GrilleProduits produits={nouveautes} defilantMobile libelle="Nouveautés" />
      </section>

      {vedette && (
        <section aria-labelledby="vedette" className="bg-primaire text-sur-primaire">
          <div className="conteneur grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
            <VisuelProduit
              produit={vedette}
              // Fond clair : le fond blanc d'une photo s'y fond (et non dans le bordeaux).
              className="mx-auto w-full max-w-sm rounded-carte"
            />
            <div className="flex flex-col items-start gap-5">
              <p className="titre-espace text-sur-primaire/70">Notre coup de cœur</p>
              <h2 id="vedette" className="text-4xl sm:text-5xl">
                {vedette.nom}
              </h2>
              <p className="max-w-md text-sur-primaire/85">
                {vedette.description || vedette.accroche}
              </p>
              {vedette.notesOlfactives && (
                <p className="text-sm text-sur-primaire/85">
                  Notes :{" "}
                  {[
                    ...vedette.notesOlfactives.tete,
                    ...vedette.notesOlfactives.coeur,
                    ...vedette.notesOlfactives.fond,
                  ].join(" · ")}
                </p>
              )}
              <Link
                href={`/produit/${vedette.slug}`}
                className="inline-flex h-13 items-center rounded-full bg-sur-primaire px-8 font-medium text-primaire transition-opacity duration-150 hover:opacity-90"
              >
                Découvrir
              </Link>
            </div>
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section aria-labelledby="conseils" className="conteneur py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="titre-espace text-texte-attenue">Le journal Énora</p>
              <h2
                id="conseils"
                className={cn(CLASSES_POLICE.princesse, "mt-3 text-5xl text-primaire sm:text-6xl")}
              >
                Nos conseils
              </h2>
            </div>
            <Link href="/conseils" className="text-sm font-medium text-primaire hover:underline">
              Tous les conseils
            </Link>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <li key={article.id}>
                <CarteArticle article={article} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
