"use client";

import { Button, FormField, Input, Textarea } from "@/shared/ui";
import { mettreAJourProfil } from "../actions/compte";
import { useFormulaireCompte } from "../hooks/useFormulaireCompte";
import { profilSchema, type ProfilSaisi } from "../schemas/compte";
import type { Utilisatrice } from "../types";
import { Message } from "./Message";

type Props = {
  utilisatrice: Utilisatrice;
  zones: { id: number; nom: string }[];
};

/** Coordonnées enregistrées : elles pré-remplissent le formulaire de commande. */
export function FormulaireProfil({ utilisatrice, zones }: Props) {
  const { formulaire, envoyer, envoi, erreur, reussite } = useFormulaireCompte<ProfilSaisi>(
    profilSchema,
    mettreAJourProfil,
    {
      nom: utilisatrice.nom,
      telephone: utilisatrice.telephone,
      adresse: utilisatrice.adresse,
      zoneId: utilisatrice.zoneId ? String(utilisatrice.zoneId) : "",
    },
  );
  const { register, formState } = formulaire;
  const { errors } = formState;

  return (
    <form onSubmit={envoyer} noValidate className="flex flex-col gap-5">
      {erreur && <Message ton="erreur">{erreur}</Message>}
      {reussite && <Message ton="reussite">{reussite}</Message>}
      <FormField libelle="Nom complet" obligatoire erreur={errors.nom?.message}>
        <Input autoComplete="name" {...register("nom")} />
      </FormField>
      <FormField libelle="Téléphone" erreur={errors.telephone?.message}>
        <Input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="77 123 45 67"
          {...register("telephone")}
        />
      </FormField>
      <FormField libelle="Zone de livraison habituelle" erreur={errors.zoneId?.message}>
        <select
          className="h-11 w-full rounded-controle border border-bordure-forte bg-surface px-4 text-base"
          {...register("zoneId")}
        >
          <option value="">— Choisir —</option>
          {zones.map((zone) => (
            <option key={zone.id} value={String(zone.id)}>
              {zone.nom}
            </option>
          ))}
        </select>
      </FormField>
      <FormField libelle="Adresse de livraison" erreur={errors.adresse?.message}>
        <Textarea autoComplete="street-address" {...register("adresse")} />
      </FormField>
      <Button type="submit" disabled={envoi} className="self-start">
        {envoi ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
