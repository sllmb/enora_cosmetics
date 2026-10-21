import type { Metadata } from "next";
import { Suspense } from "react";
import { CadreCompte } from "@/app/_composants/CadreCompte";
import { FormulaireConnexion } from "@/features/compte";

export const metadata: Metadata = { title: "Connexion" };

type Props = PageProps<"/compte/connexion">;

export default function ConnexionPage({ searchParams }: Props) {
  return (
    <CadreCompte titre="Connexion" description="Retrouvez vos commandes et vos coordonnées.">
      <Suspense
        fallback={
          <div aria-busy className="h-64 animate-pulse rounded-controle bg-surface-douce" />
        }
      >
        <Formulaire searchParams={searchParams} />
      </Suspense>
    </CadreCompte>
  );
}

async function Formulaire({ searchParams }: Pick<Props, "searchParams">) {
  const { suite, erreur } = await searchParams;
  return (
    <FormulaireConnexion
      suite={typeof suite === "string" ? suite : undefined}
      lienExpire={erreur === "lien"}
    />
  );
}
