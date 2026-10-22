"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { cn } from "@/shared/lib/cn";
import { useEstPret } from "@/shared/lib/useEstPret";
import { Button, FormField, Textarea } from "@/shared/ui";
import { deposerAvis } from "../actions/avis";
import type { DroitAvis, ResultatAvis } from "../types";

const LIBELLES = ["", "Décevant", "Moyen", "Bien", "Très bien", "Excellent"];

type Props = { produitId: number; droit: DroitAvis; cheminProduit: string };

export function FormulaireAvis({ produitId, droit, cheminProduit }: Props) {
  const pret = useEstPret();
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [resultat, setResultat] = useState<ResultatAvis>();
  const [envoi, demarrer] = useTransition();

  if (droit === "connexion") {
    return (
      <p className="text-sm text-texte-attenue">
        Vous avez acheté ce produit ?{" "}
        <Link
          href={`/compte/connexion?suite=${encodeURIComponent(cheminProduit)}`}
          className="font-medium text-primaire hover:underline"
        >
          Connectez-vous
        </Link>{" "}
        pour donner votre avis.
      </p>
    );
  }
  if (droit === "deja") {
    return <p className="text-sm text-texte-attenue">Merci, vous avez déjà donné votre avis.</p>;
  }
  if (droit === "non_eligible") {
    return (
      <p className="text-sm text-texte-attenue">
        Vous pourrez donner votre avis une fois ce produit reçu.
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
      className="flex flex-col gap-4 rounded-carte border border-bordure bg-surface p-6"
      onSubmit={(e) => {
        e.preventDefault();
        demarrer(async () => setResultat(await deposerAvis(produitId, { note, commentaire })));
      }}
    >
      <h3 className="text-2xl">Donner mon avis</h3>
      {resultat && !resultat.ok && (
        <p role="alert" className="text-sm text-danger">
          {resultat.message}
        </p>
      )}
      <fieldset>
        <legend className="mb-2 text-sm font-medium">
          Votre note <span className="text-danger">*</span>
        </legend>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primaire"
            >
              <input
                type="radio"
                name="note"
                value={n}
                checked={note === n}
                onChange={() => setNote(n)}
                className="sr-only"
              />
              <span className="sr-only">
                {n} sur 5 : {LIBELLES[n]}
              </span>
              <Star
                aria-hidden
                strokeWidth={1.5}
                className={cn("size-8 text-accent", n <= note ? "fill-accent" : "fill-transparent")}
              />
            </label>
          ))}
          {note > 0 && <span className="ml-2 text-sm text-texte-attenue">{LIBELLES[note]}</span>}
        </div>
      </fieldset>
      <FormField libelle="Votre commentaire (facultatif)">
        <Textarea
          maxLength={1000}
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Parfum, tenue, sensation sur la peau…"
        />
      </FormField>
      <Button type="submit" disabled={!pret || envoi || note === 0} className="self-start">
        {envoi ? "Envoi…" : "Publier mon avis"}
      </Button>
      <p className="text-xs text-texte-attenue">
        Votre prénom et l&apos;initiale de votre nom apparaîtront avec votre avis.
      </p>
    </form>
  );
}
