import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { STATUTS, type StatutCommande } from "@/features/commande";
import { ListeCommandesAdmin } from "@/features/commande/admin";
import { lireFiltreCommandes, listerCommandesAdmin } from "@/features/commande/serveur";
import { cn } from "@/shared/lib/cn";
import { Input } from "@/shared/ui";

export const metadata: Metadata = { title: "Commandes" };

type Props = PageProps<"/admin/commandes">;

export default function CommandesAdminPage({ searchParams }: Props) {
  return (
    <div className="px-4 py-8 sm:px-8">
      <EnteteAdmin
        titre="Commandes"
        description="Les 100 dernières, des plus récentes aux plus anciennes."
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
  const filtre = lireFiltreCommandes(await searchParams);
  const commandes = await listerCommandesAdmin(filtre);
  const lien = (statut?: StatutCommande) => {
    const params = new URLSearchParams();
    if (statut) params.set("statut", statut);
    if (filtre.recherche) params.set("q", filtre.recherche);
    const texte = params.toString();
    return `/admin/commandes${texte ? `?${texte}` : ""}`;
  };
  const pastilles: { libelle: string; statut?: StatutCommande }[] = [
    { libelle: "Toutes" },
    ...(Object.keys(STATUTS) as StatutCommande[]).map((statut) => ({
      libelle: STATUTS[statut].libelle,
      statut,
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filtrer par statut">
          <ul className="flex flex-wrap gap-2">
            {pastilles.map(({ libelle, statut }) => {
              const actif = filtre.statut === statut;
              return (
                <li key={libelle}>
                  <Link
                    href={lien(statut)}
                    aria-current={actif ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full border px-4 text-sm",
                      actif
                        ? "border-primaire bg-primaire text-sur-primaire"
                        : "border-bordure hover:border-primaire",
                    )}
                  >
                    {libelle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <form method="get" role="search" className="flex gap-2 lg:w-80">
          {filtre.statut && <input type="hidden" name="statut" value={filtre.statut} />}
          <label htmlFor="recherche-commande" className="sr-only">
            Rechercher une commande
          </label>
          <Input
            id="recherche-commande"
            name="q"
            type="search"
            defaultValue={filtre.recherche}
            placeholder="Référence, nom, téléphone"
          />
          <button
            type="submit"
            aria-label="Rechercher"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primaire text-sur-primaire"
          >
            <Search aria-hidden className="size-4" />
          </button>
        </form>
      </div>
      <ListeCommandesAdmin commandes={commandes} />
    </div>
  );
}
