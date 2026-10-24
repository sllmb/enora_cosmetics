import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import type { StatutCommentaire } from "@/features/conseils";
import { ModerationCommentaires } from "@/features/conseils/admin";
import { listerCommentairesAdmin } from "@/features/conseils/serveur";
import { cn } from "@/shared/lib/cn";

export const metadata: Metadata = { title: "Commentaires" };

type Props = PageProps<"/admin/commentaires">;

const FILTRES: { libelle: string; statut?: StatutCommentaire }[] = [
  { libelle: "À modérer", statut: "en_attente" },
  { libelle: "Publiés", statut: "publie" },
  { libelle: "Refusés", statut: "refuse" },
  { libelle: "Tous" },
];

export default function CommentairesAdminPage({ searchParams }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <EnteteAdmin
        titre="Commentaires"
        description="Un commentaire n'apparaît sous l'article qu'une fois publié."
      />
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Contenu searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Contenu({ searchParams }: Pick<Props, "searchParams">) {
  const { statut: brut } = await searchParams;
  // « À modérer » par défaut ; « tous » affiche l'ensemble.
  const statut =
    brut === "tous" ? undefined : (FILTRES.find((f) => f.statut === brut)?.statut ?? "en_attente");
  const commentaires = await listerCommentairesAdmin(statut);

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Filtrer les commentaires">
        <ul className="flex flex-wrap gap-2">
          {FILTRES.map((filtre) => {
            const actif = filtre.statut === statut;
            return (
              <li key={filtre.libelle}>
                <Link
                  href={`/admin/commentaires?statut=${filtre.statut ?? "tous"}`}
                  aria-current={actif ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full border px-4 text-sm",
                    actif
                      ? "border-primaire tissu-soie text-sur-primaire"
                      : "border-bordure hover:border-primaire",
                  )}
                >
                  {filtre.libelle}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <ModerationCommentaires commentaires={commentaires} />
    </div>
  );
}
