import type { Metadata } from "next";
import { CadreCompte } from "@/app/_composants/CadreCompte";
import { FormulaireInscription } from "@/features/compte";

export const metadata: Metadata = { title: "Créer un compte" };

export default function InscriptionPage() {
  return (
    <CadreCompte titre="Créer un compte" description="Commandez plus vite et suivez vos commandes.">
      <FormulaireInscription />
    </CadreCompte>
  );
}
