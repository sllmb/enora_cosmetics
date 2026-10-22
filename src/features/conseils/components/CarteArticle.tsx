import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { formaterDate } from "@/shared/lib/format";
import { estManuscrite } from "../lib/polices";
import { resumeArticle } from "../schemas/article";
import type { Article } from "../types";
import { CLASSES_POLICE } from "./polices";

export function CarteArticle({ article }: { article: Article }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-carte border border-bordure bg-surface shadow-carte">
      <div className="relative aspect-[16/10] bg-surface-douce">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-280 ease-douce group-hover:scale-[1.03]"
          />
        ) : (
          <span aria-hidden className="flex size-full items-center justify-center text-primaire/40">
            <Sparkles className="size-10" strokeWidth={1} />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        {article.publieLe && (
          <p className="text-xs text-texte-attenue">{formaterDate(article.publieLe)}</p>
        )}
        <h3
          className={cn(
            "leading-tight",
            CLASSES_POLICE[article.policeTitre],
            estManuscrite(article.policeTitre) ? "text-3xl" : "text-2xl",
          )}
        >
          <Link
            href={`/conseils/${article.slug}`}
            className="after:absolute after:inset-0 hover:text-primaire"
          >
            {article.titre}
          </Link>
        </h3>
        <p className="text-sm text-texte-attenue">{resumeArticle(article)}</p>
      </div>
    </article>
  );
}
