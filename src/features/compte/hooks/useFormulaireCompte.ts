"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm, type DefaultValues, type FieldValues, type Path } from "react-hook-form";
import type { z } from "zod";
import type { ResultatAction } from "../types";

/**
 * Formulaire du compte : validation Zod dans le navigateur, puis Server Action
 * (qui revalide). Les erreurs du serveur sont replacées sur les champs, le
 * message général et le message de réussite sont exposés à l'affichage.
 */
export function useFormulaireCompte<T extends FieldValues>(
  schema: z.ZodType<unknown, T>,
  action: (donnees: unknown) => Promise<ResultatAction>,
  valeursInitiales: DefaultValues<T>,
) {
  const formulaire = useForm<T>({
    resolver: zodResolver(schema as never),
    defaultValues: valeursInitiales,
  });
  const [envoi, demarrer] = useTransition();
  const [erreur, setErreur] = useState<string>();
  const [reussite, setReussite] = useState<string>();

  const envoyer = formulaire.handleSubmit((valeurs) =>
    demarrer(async () => {
      setErreur(undefined);
      setReussite(undefined);
      // Une action qui redirige ne renvoie rien : la navigation prend le relais.
      const resultat = await action(valeurs);
      if (!resultat) return;
      if (resultat.ok) {
        setReussite(resultat.message);
        return;
      }
      for (const [champ, message] of Object.entries(resultat.erreurs ?? {})) {
        if (message) formulaire.setError(champ as Path<T>, { message });
      }
      setErreur(resultat.message);
    }),
  );

  return { formulaire, envoyer, envoi, erreur, reussite };
}
