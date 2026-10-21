"use client";

import Link from "next/link";
import { Button, ChampMotDePasse, FormField, Input } from "@/shared/ui";
import { seConnecter } from "../actions/compte";
import { useFormulaireCompte } from "../hooks/useFormulaireCompte";
import { connexionSchema, type ConnexionSaisie } from "../schemas/compte";
import { Message } from "./Message";

type Props = { suite?: string; lienExpire?: boolean };

export function FormulaireConnexion({ suite, lienExpire }: Props) {
  const { formulaire, envoyer, envoi, bloque, erreur } = useFormulaireCompte<ConnexionSaisie>(
    connexionSchema,
    (donnees) => seConnecter(donnees, suite),
    { email: "", motDePasse: "" },
  );
  const { register, formState } = formulaire;
  const lienInscription = suite
    ? `/compte/inscription?suite=${encodeURIComponent(suite)}`
    : "/compte/inscription";

  return (
    <form method="post" onSubmit={envoyer} noValidate className="flex flex-col gap-5">
      {lienExpire && !erreur && (
        <Message ton="erreur">
          Ce lien n&apos;est plus valable. Connectez-vous, ou demandez un nouveau lien.
        </Message>
      )}
      {erreur && <Message ton="erreur">{erreur}</Message>}
      <FormField libelle="Email" obligatoire erreur={formState.errors.email?.message}>
        <Input type="email" autoComplete="email" {...register("email")} />
      </FormField>
      <FormField libelle="Mot de passe" obligatoire erreur={formState.errors.motDePasse?.message}>
        <ChampMotDePasse autoComplete="current-password" {...register("motDePasse")} />
      </FormField>
      <Link
        href="/compte/mot-de-passe-oublie"
        className="-mt-2 self-end text-sm text-primaire hover:underline"
      >
        Mot de passe oublié ?
      </Link>
      <Button type="submit" taille="lg" disabled={bloque}>
        {envoi ? "Connexion…" : "Se connecter"}
      </Button>
      <p className="text-center text-sm text-texte-attenue">
        Pas encore de compte ?{" "}
        <Link href={lienInscription} className="font-medium text-primaire hover:underline">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
