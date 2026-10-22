import { NotebookPen } from "lucide-react";
import type { Metadata } from "next";
import { OPEN_GRAPH_BASE } from "@/app/_seo";
import { CarteArticle } from "@/features/conseils";
import { listerArticles } from "@/features/conseils/serveur";
import { ButtonLink, EmptyState } from "@/shared/ui";

const DESCRIPTION =
  "Routines, choix d'un parfum, gestes simples : nos conseils pour une hygiène corporelle au quotidien.";

export const metadata: Metadata = {
  title: "Conseils",
  description: DESCRIPTION,
  alternates: { canonical: "/conseils" },
  openGraph: { ...OPEN_GRAPH_BASE, title: "Conseils", description: DESCRIPTION, url: "/conseils" },
};

export default async function ConseilsPage() {
  const articles = await listerArticles();
  return (
    <div className="conteneur py-12 sm:py-16">
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <p className="titre-espace text-texte-attenue">Le journal Énora</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">Conseils</h1>
        <p className="mt-4 text-lg text-texte-attenue">{DESCRIPTION}</p>
      </header>
      {articles.length === 0 ? (
        <EmptyState
          icone={<NotebookPen className="size-7" strokeWidth={1.5} />}
          titre="Nos premiers conseils arrivent bientôt"
          description="En attendant, découvrez nos produits."
          action={<ButtonLink href="/boutique">Voir la boutique</ButtonLink>}
        />
      ) : (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.id}>
              <CarteArticle article={article} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
