"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { Button, ChampMotDePasse, EmptyState, FormField, Input } from "@/shared/ui";
import { sInscrire } from "../actions/compte";
import { useFormulaireCompte } from "../hooks/useFormulaireCompte";
import { inscriptionSchema, type InscriptionSaisie } from "../schemas/compte";
import { Message } from "./Message";

export function FormulaireInscription() {
  const { formulaire, envoyer, envoi, erreur, reussite } = useFormulaireCompte<InscriptionSaisie>(
    inscriptionSchema,
    sInscrire,
    { nom: "", email: "", motDePasse: "", confirmation: "" },
  );
  const { register, formState } = formulaire;
  const { errors } = formState;

  if (reussite) {
    return (
      <EmptyState
        icone={<MailCheck className="size-7" strokeWidth={1.5} />}
        titre="Vérifiez vos emails"
        description={reussite}
      />
    );
  }

  return (
    <form onSubmit={envoyer} noValidate className="flex flex-col gap-5">
      {erreur && <Message ton="erreur">{erreur}</Message>}
      <FormField libelle="Nom complet" obligatoire erreur={errors.nom?.message}>
        <Input autoComplete="name" {...register("nom")} />
      </FormField>
      <FormField libelle="Email" obligatoire erreur={errors.email?.message}>
        <Input type="email" autoComplete="email" {...register("email")} />
      </FormField>
      <FormField
        libelle="Mot de passe"
        obligatoire
        aide="Au moins 8 caractères, dont une lettre et un chiffre."
        erreur={errors.motDePasse?.message}
      >
        <ChampMotDePasse autoComplete="new-password" {...register("motDePasse")} />
      </FormField>
      <FormField
        libelle="Confirmer le mot de passe"
        obligatoire
        erreur={errors.confirmation?.message}
      >
        <ChampMotDePasse autoComplete="new-password" {...register("confirmation")} />
      </FormField>
      <Button type="submit" taille="lg" disabled={envoi}>
        {envoi ? "Création…" : "Créer mon compte"}
      </Button>
      <p className="text-center text-sm text-texte-attenue">
        Déjà un compte ?{" "}
        <Link href="/compte/connexion" className="font-medium text-primaire hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
