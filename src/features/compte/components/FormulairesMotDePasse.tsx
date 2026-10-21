"use client";

import Link from "next/link";
import { Button, ChampMotDePasse, FormField, Input } from "@/shared/ui";
import { changerMotDePasse, demanderReinitialisation } from "../actions/compte";
import { useFormulaireCompte } from "../hooks/useFormulaireCompte";
import {
  motDePasseOublieSchema,
  nouveauMotDePasseSchema,
  type MotDePasseOublieSaisie,
  type NouveauMotDePasseSaisie,
} from "../schemas/compte";
import { Message } from "./Message";

export function FormulaireMotDePasseOublie() {
  const { formulaire, envoyer, envoi, erreur, reussite } =
    useFormulaireCompte<MotDePasseOublieSaisie>(motDePasseOublieSchema, demanderReinitialisation, {
      email: "",
    });
  const { register, formState } = formulaire;

  if (reussite) {
    return (
      <div className="flex flex-col gap-5">
        <Message ton="reussite">{reussite}</Message>
        <Link
          href="/compte/connexion"
          className="text-center text-sm text-primaire hover:underline"
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} noValidate className="flex flex-col gap-5">
      {erreur && <Message ton="erreur">{erreur}</Message>}
      <FormField
        libelle="Email du compte"
        obligatoire
        aide="Vous recevrez un lien pour choisir un nouveau mot de passe."
        erreur={formState.errors.email?.message}
      >
        <Input type="email" autoComplete="email" {...register("email")} />
      </FormField>
      <Button type="submit" taille="lg" disabled={envoi}>
        {envoi ? "Envoi…" : "Recevoir le lien"}
      </Button>
    </form>
  );
}

export function FormulaireNouveauMotDePasse() {
  const { formulaire, envoyer, envoi, erreur } = useFormulaireCompte<NouveauMotDePasseSaisie>(
    nouveauMotDePasseSchema,
    changerMotDePasse,
    { motDePasse: "", confirmation: "" },
  );
  const { register, formState } = formulaire;
  return (
    <form onSubmit={envoyer} noValidate className="flex flex-col gap-5">
      {erreur && <Message ton="erreur">{erreur}</Message>}
      <FormField
        libelle="Nouveau mot de passe"
        obligatoire
        aide="Au moins 8 caractères, dont une lettre et un chiffre."
        erreur={formState.errors.motDePasse?.message}
      >
        <ChampMotDePasse autoComplete="new-password" {...register("motDePasse")} />
      </FormField>
      <FormField libelle="Confirmer" obligatoire erreur={formState.errors.confirmation?.message}>
        <ChampMotDePasse autoComplete="new-password" {...register("confirmation")} />
      </FormField>
      <Button type="submit" taille="lg" disabled={envoi}>
        {envoi ? "Enregistrement…" : "Enregistrer le mot de passe"}
      </Button>
    </form>
  );
}
