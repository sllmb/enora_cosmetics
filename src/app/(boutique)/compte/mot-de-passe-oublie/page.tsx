import type { Metadata } from "next";
import { CadreCompte } from "@/app/_composants/CadreCompte";
import { FormulaireMotDePasseOublie } from "@/features/compte";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function MotDePasseOubliePage() {
  return (
    <CadreCompte titre="Mot de passe oublié">
      <FormulaireMotDePasseOublie />
    </CadreCompte>
  );
}
