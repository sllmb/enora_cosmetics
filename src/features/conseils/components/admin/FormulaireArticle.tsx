"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/shared/lib/cn";
import { useEstPret } from "@/shared/lib/useEstPret";
import { Button, FormField, Input, Textarea } from "@/shared/ui";
import { enregistrerArticle } from "../../actions/conseils";
import { estManuscrite, LIBELLES_POLICE, POLICES_TITRE } from "../../lib/polices";
import { articleSchema, type ArticleSaisi, type ArticleValide } from "../../schemas/article";
import type { Article } from "../../types";
import { ContenuArticle } from "../ContenuArticle";
import { CLASSES_POLICE } from "../polices";
import { BarreMiseEnForme } from "./BarreMiseEnForme";

export function FormulaireArticle({ article }: { article?: Article }) {
  const router = useRouter();
  const pret = useEstPret();
  const [envoi, demarrer] = useTransition();
  const [apercu, setApercu] = useState(false);
  const zoneTexte = useRef<HTMLTextAreaElement | null>(null);
  const { register, handleSubmit, setError, setValue, getValues, control, formState } = useForm<
    ArticleSaisi,
    unknown,
    ArticleValide
  >({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      titre: article?.titre ?? "",
      extrait: article?.extrait ?? "",
      contenu: article?.contenu ?? "",
      publie: article ? article.publieLe !== null : false,
      policeTitre: article?.policeTitre ?? "classique",
    },
  });
  const [titre, contenu, police] = useWatch({ control, name: ["titre", "contenu", "policeTitre"] });
  const { errors } = formState;
  const champContenu = register("contenu");

  const envoyer = handleSubmit(() =>
    demarrer(async () => {
      // Le serveur revalide la saisie brute (et non la version déjà transformée ici).
      const resultat = await enregistrerArticle(article?.id ?? null, getValues());
      if (!resultat.ok) {
        for (const [champ, message] of Object.entries(resultat.erreurs ?? {})) {
          if (message) setError(champ as keyof ArticleSaisi, { message });
        }
        toast.error(resultat.message);
        return;
      }
      toast.success(article ? "Article enregistré." : "Article créé.");
      if (article) router.refresh();
      else router.push(`/admin/articles/${resultat.id}`);
    }),
  );

  return (
    <form method="post" onSubmit={envoyer} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-carte border border-bordure bg-surface p-6">
        <FormField libelle="Titre" obligatoire erreur={errors.titre?.message}>
          <Input {...register("titre")} />
        </FormField>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Écriture du titre</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {POLICES_TITRE.map((p) => (
              <label
                key={p}
                className={cn(
                  "flex cursor-pointer flex-col gap-1 rounded-controle border p-3 transition-colors",
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primaire",
                  police === p
                    ? "border-primaire bg-primaire-doux"
                    : "border-bordure hover:border-primaire",
                )}
              >
                <input type="radio" value={p} className="sr-only" {...register("policeTitre")} />
                <span
                  aria-hidden
                  className={cn(
                    "truncate text-primaire",
                    CLASSES_POLICE[p],
                    estManuscrite(p) ? "text-3xl" : "text-2xl",
                  )}
                >
                  {titre || "Bien choisir son parfum"}
                </span>
                <span className="text-xs text-texte-attenue">
                  <span className="font-medium text-texte">{LIBELLES_POLICE[p].libelle}</span> ·{" "}
                  {LIBELLES_POLICE[p].description}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <FormField
          libelle="Résumé"
          aide="Affiché sur la couverture, dans la liste des conseils et sur Google. Facultatif."
          erreur={errors.extrait?.message}
        >
          <Textarea rows={2} {...register("extrait")} />
        </FormField>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span id="libelle-contenu" className="text-sm font-medium">
              Texte de l&apos;article <span className="text-danger">*</span>
            </span>
            <Button taille="sm" variante="discret" onClick={() => setApercu((a) => !a)}>
              {apercu ? "Modifier" : "Aperçu"}
            </Button>
          </div>
          {apercu ? (
            <div className="min-h-64 rounded-controle border border-bordure bg-fond p-5">
              <h2
                className={cn(
                  "mb-6 leading-tight text-primaire",
                  CLASSES_POLICE[police],
                  estManuscrite(police) ? "text-5xl" : "text-4xl",
                )}
              >
                {titre || "Titre de l'article"}
              </h2>
              <ContenuArticle
                contenu={contenu || "*Rien à afficher pour l'instant.*"}
                police={police}
              />
            </div>
          ) : (
            <div>
              <BarreMiseEnForme
                zone={zoneTexte}
                onChange={(texte) =>
                  setValue("contenu", texte, { shouldDirty: true, shouldValidate: true })
                }
              />
              <Textarea
                rows={16}
                aria-labelledby="libelle-contenu"
                aria-invalid={errors.contenu ? true : undefined}
                className="rounded-t-none"
                {...champContenu}
                ref={(element) => {
                  champContenu.ref(element);
                  zoneTexte.current = element;
                }}
              />
              {errors.contenu ? (
                <p role="alert" className="mt-1.5 text-sm text-danger">
                  {errors.contenu.message}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-texte-attenue">
                  Sélectionnez un mot puis cliquez sur un bouton pour le mettre en forme.
                </p>
              )}
            </div>
          )}
        </div>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-primaire"
            {...register("publie")}
          />
          <span>
            <span className="font-medium">Publié</span>
            <span className="block text-texte-attenue">
              Décoché, l&apos;article reste un brouillon invisible sur le site.
            </span>
          </span>
        </label>
      </div>
      <div className="flex justify-end">
        <Button type="submit" taille="lg" disabled={envoi || !pret}>
          {envoi ? "Enregistrement…" : article ? "Enregistrer" : "Créer l'article"}
        </Button>
      </div>
    </form>
  );
}
