"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { estActif, type LienMenu } from "../_navigation/menus";

type Props = {
  liens: LienMenu[];
  classeListe?: string;
  classeLien?: string;
  /** Liste imbriquée des sous-menus (tiroir mobile). */
  classeSousListe?: string;
  classeSousLien?: string;
  onNavigate?: () => void;
};

function Liste({
  liens,
  classeListe,
  classeLien,
  classeSousListe,
  classeSousLien,
  onNavigate,
  chemin,
}: Props & { chemin: string | null }) {
  return (
    <ul className={classeListe}>
      {liens.map((lien) =>
        lien.enfants ? (
          <li key={lien.libelle}>
            <span className={classeLien}>{lien.libelle}</span>
            <ul className={classeSousListe}>
              {lien.enfants.map((enfant) => (
                <li key={enfant.href}>
                  <Link
                    href={enfant.href}
                    onClick={onNavigate}
                    aria-current={chemin && estActif(enfant, chemin) ? "page" : undefined}
                    className={classeSousLien}
                  >
                    {enfant.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <li key={lien.href}>
            <Link
              href={lien.href}
              onClick={onNavigate}
              aria-current={chemin && estActif(lien, chemin) ? "page" : undefined}
              className={classeLien}
            >
              {lien.libelle}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}

function ListeActive(props: Props) {
  return <Liste {...props} chemin={usePathname()} />;
}

/**
 * Liste de liens qui marque la page courante (aria-current). Le chemin n'est
 * connu qu'à l'exécution : la version sans état actif sert de rendu statique
 * pour que les pages dynamiques restent pré-rendues (Cache Components).
 */
export function ListeLiens(props: Props) {
  return (
    <Suspense fallback={<Liste {...props} chemin={null} />}>
      <ListeActive {...props} />
    </Suspense>
  );
}
