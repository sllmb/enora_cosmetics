"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useEstPret } from "@/shared/lib/useEstPret";
import { Button, FormField, Input, Textarea } from "@/shared/ui";
import { enregistrerArticle } from "../../actions/conseils";
import { articleSchema, type ArticleSaisi, type ArticleValide } from "../../schemas/article";
import type { Article } from "../../types";
import { ContenuArticle } from "../ContenuArticle";

const AIDE_MARKDOWN =
  "## Sous-titre · **gras** · *italique* · - liste · [lien](https://…) · > citation";

export function FormulaireArticle({ article }: { article?: Article }) {
  const router = useRouter();
  const pret = useEstPret();
  const [envoi, demarrer] = useTransition();
  const [apercu, setApercu] = useState(false);
  const { register, handleSubmit, setError, getValues, control, formState } = useForm<
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
    },
  });
  const contenu = useWatch({ control, name: "contenu" });
  const { errors } = formState;

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
        <FormField
          libelle="Résumé"
          aide="Affiché dans la liste des conseils et sur Google. Facultatif."
          erreur={errors.extrait?.message}
        >
          <Textarea rows={2} {...register("extrait")} />
        </FormField>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">
              Texte de l&apos;article <span className="text-danger">*</span>
            </span>
            <Button taille="sm" variante="discret" onClick={() => setApercu((a) => !a)}>
              {apercu ? "Modifier" : "Aperçu"}
            </Button>
          </div>
          {apercu ? (
            <div className="min-h-64 rounded-controle border border-bordure bg-fond p-5">
              <ContenuArticle contenu={contenu || "*Rien à afficher pour l'instant.*"} />
            </div>
          ) : (
            <FormField
              libelle="Texte de l'article (Markdown)"
              aide={AIDE_MARKDOWN}
              erreur={errors.contenu?.message}
            >
              <Textarea rows={16} className="font-mono text-sm" {...register("contenu")} />
            </FormField>
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
