import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { FormulaireArticle, ImageArticle, SuppressionArticle } from "@/features/conseils/admin";
import { listerProduits } from "@/features/catalogue/serveur";
import { lireArticleAdmin } from "@/features/conseils/serveur";

export const metadata: Metadata = { title: "Modifier l'article" };

type Props = PageProps<"/admin/articles/[id]">;

export default function ArticleAdminPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Contenu params={params} />
      </Suspense>
    </div>
  );
}

async function Contenu({ params }: Pick<Props, "params">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [article, produits] = await Promise.all([lireArticleAdmin(id), listerProduits()]);
  if (!article) notFound();

  return (
    <>
      <EnteteAdmin
        titre={article.titre}
        retour={
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-1 text-sm text-texte-attenue hover:text-primaire"
          >
            <ArrowLeft aria-hidden className="size-4" /> Conseils
          </Link>
        }
        action={
          article.publieLe && (
            <Link
              href={`/conseils/${article.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-primaire hover:underline"
            >
              <ExternalLink aria-hidden className="size-4" /> Voir sur le site
            </Link>
          )
        }
      />
      <section
        aria-labelledby="couverture"
        className="mb-6 rounded-carte border border-bordure bg-surface p-6"
      >
        <h2 id="couverture" className="mb-4 font-titre text-2xl">
          Image de couverture
        </h2>
        <ImageArticle articleId={article.id} imageUrl={article.imageUrl} />
      </section>
      <FormulaireArticle article={article} produits={produits} />
      <div className="mt-6 flex justify-end">
        <SuppressionArticle id={article.id} titre={article.titre} />
      </div>
    </>
  );
}
