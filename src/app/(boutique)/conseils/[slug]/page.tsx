import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OPEN_GRAPH_BASE } from "@/app/_seo";
import {
  CarteArticle,
  ContenuArticle,
  CouvertureArticle,
  FormulaireCommentaire,
  ListeCommentaires,
  resumeArticle,
} from "@/features/conseils";
import {
  estConnectee,
  lireArticle,
  listerArticles,
  listerCommentaires,
} from "@/features/conseils/serveur";
import { listerProduits } from "@/features/catalogue/serveur";
import { slugsProduits } from "@/features/conseils";
import { env } from "@/shared/config/env";
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
  const [tous, commentaires, catalogue] = await Promise.all([
    listerArticles(),
    listerCommentaires(article.id),
    listerProduits(),
  ]);
  const cites = new Set(slugsProduits(article.contenu));
  const autres = tous.filter((a) => a.id !== article.id).slice(0, 3);

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
      <article>
        <CouvertureArticle article={article} />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <ContenuArticle
            contenu={article.contenu}
            police={article.policeTitre}
            produits={catalogue.filter((p) => cites.has(p.slug))}
          />
          <div className="mt-12 flex flex-col items-start gap-4 rounded-carte bg-surface-douce p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-titre text-2xl">Envie de passer à la pratique ?</p>
            <ButtonLink href="/boutique">Découvrir nos produits</ButtonLink>
          </div>
        </div>
        <section aria-labelledby="commentaires" className="mx-auto max-w-3xl px-4 pb-16">
          <h2 id="commentaires" className="mb-6 scroll-mt-28 text-3xl">
            Commentaires{commentaires.length > 0 && ` (${commentaires.length})`}
          </h2>
          <div className="flex flex-col gap-8">
            <ListeCommentaires commentaires={commentaires} />
            {/* Lit la session : chargé à part, le reste de l'article reste pré-calculé. */}
            <Suspense fallback={null}>
              <DepotCommentaire articleId={article.id} slug={article.slug} />
            </Suspense>
          </div>
        </section>
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

async function DepotCommentaire({ articleId, slug }: { articleId: number; slug: string }) {
  return (
    <FormulaireCommentaire
      articleId={articleId}
      connectee={await estConnectee()}
      cheminArticle={`/conseils/${slug}`}
    />
  );
}
