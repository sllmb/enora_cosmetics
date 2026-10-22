"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useEstPret } from "@/shared/lib/useEstPret";
import { Button, FormField, Textarea } from "@/shared/ui";
import { deposerCommentaire } from "../actions/commentaires";
import type { ResultatCommentaire } from "../types";

type Props = { articleId: number; connectee: boolean; cheminArticle: string };

export function FormulaireCommentaire({ articleId, connectee, cheminArticle }: Props) {
  const pret = useEstPret();
  const [contenu, setContenu] = useState("");
  const [resultat, setResultat] = useState<ResultatCommentaire>();
  const [envoi, demarrer] = useTransition();

  if (!connectee) {
    return (
      <p className="rounded-carte border border-bordure p-5 text-sm text-texte-attenue">
        <Link
          href={`/compte/connexion?suite=${encodeURIComponent(`${cheminArticle}#commentaires`)}`}
          className="font-medium text-primaire hover:underline"
        >
          Connectez-vous
        </Link>{" "}
        pour laisser un commentaire.
      </p>
    );
  }
  if (resultat?.ok) {
    return (
      <p role="status" className="rounded-controle bg-succes-doux p-4 text-sm text-succes">
        {resultat.message}
      </p>
    );
  }

  return (
    <form
      method="post"
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        demarrer(async () => setResultat(await deposerCommentaire(articleId, { contenu })));
      }}
    >
      {resultat && (
        <p role="alert" className="text-sm text-danger">
          {resultat.message}
        </p>
      )}
      <FormField
        libelle="Votre commentaire"
        aide="Votre prénom et l'initiale de votre nom apparaîtront après validation."
      >
        <Textarea
          rows={4}
          maxLength={1000}
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Une question, une astuce à partager…"
        />
      </FormField>
      <Button
        type="submit"
        disabled={!pret || envoi || contenu.trim().length < 2}
        className="self-start"
      >
        {envoi ? "Envoi…" : "Envoyer mon commentaire"}
      </Button>
    </form>
  );
}
