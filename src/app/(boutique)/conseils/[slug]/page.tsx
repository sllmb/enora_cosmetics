import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OPEN_GRAPH_BASE } from "@/app/_seo";
import { CarteArticle, ContenuArticle, resumeArticle } from "@/features/conseils";
import { lireArticle, listerArticles } from "@/features/conseils/serveur";
import { env } from "@/shared/config/env";
import { formaterDate } from "@/shared/lib/format";
import { ButtonLink, JsonLd } from "@/shared/ui";

type Props = PageProps<"/conseils/[slug]">;

export async function generateStaticParams() {
  const articles = await listerArticles();
  // Au moins une adresse est exigée au build : sans article, celle-ci mène à la page 404.
  if (articles.length === 0) return [{ slug: "aucun-article" }];
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await lireArticle((await params).slug);
  if (!article) return {};
  const description = resumeArticle(article);
  return {
    title: article.titre,
    description,
    alternates: { canonical: `/conseils/${article.slug}` },
    openGraph: {
      ...OPEN_GRAPH_BASE,
      type: "article",
      title: article.titre,
      description,
      url: `/conseils/${article.slug}`,
      ...(article.publieLe && { publishedTime: article.publieLe }),
      images: article.imageUrl ? [{ url: article.imageUrl, alt: "" }] : OPEN_GRAPH_BASE.images,
    },
  };
}

export default function ArticlePage({ params }: Props) {
  return (
    <Suspense fallback={<SqueletteArticle />}>
      <ContenuPage params={params} />
    </Suspense>
  );
}

function SqueletteArticle() {
  return (
    <div aria-busy className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-12">
      <div className="h-4 w-32 animate-pulse rounded-full bg-surface-douce" />
      <div className="h-14 w-3/4 animate-pulse rounded-controle bg-surface-douce" />
      <div className="aspect-[16/9] animate-pulse rounded-carte bg-surface-douce" />
    </div>
  );
}

async function ContenuPage({ params }: Pick<Props, "params">) {
  const article = await lireArticle((await params).slug);
  if (!article) notFound();
  const autres = (await listerArticles()).filter((a) => a.id !== article.id).slice(0, 3);

  const jsonLd = {
    "@type": "Article",
    headline: article.titre,
    description: resumeArticle(article),
    ...(article.imageUrl && { image: [article.imageUrl] }),
    ...(article.publieLe && { datePublished: article.publieLe }),
    dateModified: article.misAJourLe,
    author: { "@type": "Organization", name: "Énora Cosmetics" },
    publisher: { "@type": "Organization", name: "Énora Cosmetics" },
    mainEntityOfPage: `${env.siteUrl}/conseils/${article.slug}`,
  };

  return (
    <>
      <JsonLd donnees={jsonLd} />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <Link
          href="/conseils"
          className="inline-flex items-center gap-1 text-sm text-texte-attenue hover:text-primaire"
        >
          <ArrowLeft aria-hidden className="size-4" /> Tous les conseils
        </Link>
        <header className="mt-6 mb-10 flex flex-col gap-4">
          {article.publieLe && (
            <p className="titre-espace text-texte-attenue">
              <time dateTime={article.publieLe}>{formaterDate(article.publieLe)}</time>
            </p>
          )}
          <h1 className="text-4xl leading-tight sm:text-6xl">{article.titre}</h1>
          {article.extrait && <p className="text-xl text-texte-attenue">{article.extrait}</p>}
        </header>
        {article.imageUrl && (
          <Image
            src={article.imageUrl}
            alt=""
            width={1600}
            height={1000}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="mb-10 aspect-[16/10] w-full rounded-carte object-cover"
          />
        )}
        <ContenuArticle contenu={article.contenu} />
        <div className="mt-12 flex flex-col items-start gap-4 rounded-carte bg-surface-douce p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-titre text-2xl">Envie de passer à la pratique ?</p>
          <ButtonLink href="/boutique">Découvrir nos produits</ButtonLink>
        </div>
      </article>
      {autres.length > 0 && (
        <section aria-labelledby="autres-conseils" className="conteneur pb-20">
          <h2 id="autres-conseils" className="mb-8 text-center text-4xl">
            À lire aussi
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {autres.map((a) => (
              <li key={a.id}>
                <CarteArticle article={a} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
