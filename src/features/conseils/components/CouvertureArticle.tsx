import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { formaterDate } from "@/shared/lib/format";
import { estManuscrite } from "../lib/polices";
import type { Article } from "../types";
import { CLASSES_POLICE } from "./polices";

/**
 * Page de garde d'un article : l'image de couverture occupe le haut de la page,
 * le titre est écrit par-dessus dans la police choisie. Sans image, un fond doux.
 */
export function CouvertureArticle({ article }: { article: Article }) {
  const avecImage = Boolean(article.imageUrl);
  return (
    <header
      className={cn(
        "relative isolate flex min-h-[26rem] flex-col overflow-hidden sm:min-h-[34rem]",
        avecImage ? "text-sur-primaire lg:min-h-[78svh]" : "bg-primaire-doux text-primaire",
      )}
    >
      {article.imageUrl && (
        <>
          <Image
            src={article.imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          {/* Voile pour garder le titre lisible quelle que soit la photo. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/10"
          />
        </>
      )}
      <div className="conteneur pt-6">
        <Link
          href="/conseils"
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm backdrop-blur-sm",
            avecImage ? "bg-black/25 hover:bg-black/40" : "bg-surface/70 hover:bg-surface",
          )}
        >
          <ArrowLeft aria-hidden className="size-4" /> Tous les conseils
        </Link>
      </div>
      <div className="conteneur mt-auto flex max-w-4xl flex-col items-center gap-5 pt-16 pb-14 text-center sm:pb-20">
        {article.publieLe && (
          <p
            className={cn(
              "titre-espace",
              avecImage ? "text-sur-primaire/80" : "text-texte-attenue",
            )}
          >
            Le journal Énora ·{" "}
            <time dateTime={article.publieLe}>{formaterDate(article.publieLe)}</time>
          </p>
        )}
        <h1
          className={cn(
            "leading-tight text-balance",
            CLASSES_POLICE[article.policeTitre],
            estManuscrite(article.policeTitre)
              ? "text-6xl sm:text-7xl lg:text-8xl"
              : "text-5xl sm:text-6xl lg:text-7xl",
            avecImage && "drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)]",
          )}
        >
          {article.titre}
        </h1>
        {article.extrait && (
          <p
            className={cn(
              "max-w-2xl text-lg sm:text-xl",
              avecImage ? "text-sur-primaire/90" : "text-texte-attenue",
            )}
          >
            {article.extrait}
          </p>
        )}
      </div>
    </header>
  );
}
