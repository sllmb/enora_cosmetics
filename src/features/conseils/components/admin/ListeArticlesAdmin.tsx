import { ChevronRight, NotebookPen } from "lucide-react";
import Link from "next/link";
import { formaterDate } from "@/shared/lib/format";
import { Badge, EmptyState } from "@/shared/ui";
import type { Article } from "../../types";

export function ListeArticlesAdmin({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <EmptyState
        icone={<NotebookPen className="size-7" strokeWidth={1.5} />}
        titre="Aucun article"
        description="Rédigez votre premier conseil : routine, choix d'un parfum, conservation…"
      />
    );
  }
  return (
    <ul className="divide-y divide-bordure rounded-carte border border-bordure bg-surface">
      {articles.map((article) => (
        <li key={article.id}>
          <Link
            href={`/admin/articles/${article.id}`}
            className="flex items-center gap-4 px-4 py-4 hover:bg-surface-douce/60 sm:px-6"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate font-medium">{article.titre}</p>
              <p className="text-xs text-texte-attenue">
                Modifié le {formaterDate(article.misAJourLe)}
              </p>
            </div>
            {article.publieLe ? <Badge ton="succes">Publié</Badge> : <Badge>Brouillon</Badge>}
            <ChevronRight aria-hidden className="size-4 shrink-0 text-texte-attenue" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
