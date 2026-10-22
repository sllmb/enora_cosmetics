"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge, Button, DialogueConfirmation, FormField, Input } from "@/shared/ui";
import { enregistrerCategorie, supprimerCategorie } from "../../actions/admin";
import type { CategorieAdmin } from "../../queries/admin";
import {
  categorieAdminSchema,
  type CategorieAdminSaisie,
  type CategorieAdminValide,
} from "../../schemas/admin";

export function GestionCategories({ categories }: { categories: CategorieAdmin[] }) {
  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-4">
        {categories.map((categorie) => (
          <li key={categorie.id}>
            <FicheCategorie categorie={categorie} />
          </li>
        ))}
      </ul>
      <section className="rounded-carte border-2 border-dashed border-bordure-forte p-6">
        <h2 className="mb-4 text-2xl">Nouvelle catégorie</h2>
        <FicheCategorie ordreSuivant={(categories.at(-1)?.ordre ?? 0) + 1} />
      </section>
    </div>
  );
}

type Props = { categorie?: CategorieAdmin; ordreSuivant?: number };

function FicheCategorie({ categorie, ordreSuivant = 1 }: Props) {
  const router = useRouter();
  const [envoi, demarrer] = useTransition();
  const { register, handleSubmit, reset, getValues, formState } = useForm<
    CategorieAdminSaisie,
    unknown,
    CategorieAdminValide
  >({
    resolver: zodResolver(categorieAdminSchema),
    defaultValues: {
      nom: categorie?.nom ?? "",
      description: categorie?.description ?? "",
      ordre: String(categorie?.ordre ?? ordreSuivant),
      active: categorie?.active ?? true,
    },
  });

  const envoyer = handleSubmit(() =>
    demarrer(async () => {
      // Le serveur revalide la saisie brute (et non la version déjà transformée ici).
      const resultat = await enregistrerCategorie(categorie?.id ?? null, getValues());
      if (!resultat.ok) return void toast.error(resultat.message);
      toast.success(categorie ? "Catégorie enregistrée." : "Catégorie créée.");
      if (!categorie) reset();
      router.refresh();
    }),
  );

  const contenu = (
    <form method="post" onSubmit={envoyer} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_6rem]">
        <FormField libelle="Nom" obligatoire erreur={formState.errors.nom?.message}>
          <Input {...register("nom")} />
        </FormField>
        <FormField libelle="Ordre" erreur={formState.errors.ordre?.message}>
          <Input inputMode="numeric" {...register("ordre")} />
        </FormField>
      </div>
      <FormField libelle="Description" erreur={formState.errors.description?.message}>
        <Input {...register("description")} />
      </FormField>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primaire" {...register("active")} />
          Visible dans la boutique
        </label>
        <div className="flex gap-2">
          {categorie && (
            <DialogueConfirmation
              declencheur={
                <Button variante="discret" taille="sm" disabled={envoi} className="text-danger">
                  Supprimer
                </Button>
              }
              titre={`Supprimer « ${categorie.nom} » ?`}
              description="Possible uniquement si elle ne contient aucun produit."
              libelleConfirmer="Supprimer"
              onConfirmer={() =>
                demarrer(async () => {
                  const resultat = await supprimerCategorie(categorie.id);
                  if (!resultat.ok) return void toast.error(resultat.message);
                  toast.success("Catégorie supprimée.");
                  router.refresh();
                })
              }
            />
          )}
          <Button type="submit" taille="sm" disabled={envoi}>
            {categorie ? "Enregistrer" : "Ajouter"}
          </Button>
        </div>
      </div>
    </form>
  );

  if (!categorie) return contenu;
  return (
    <div className="flex flex-col gap-3 rounded-carte border border-bordure bg-surface p-6">
      <p className="flex flex-wrap items-center gap-2 text-sm text-texte-attenue">
        /boutique/{categorie.slug}
        <Badge>{categorie.nombreProduits} produit(s)</Badge>
        {!categorie.active && <Badge ton="avertissement">Masquée</Badge>}
      </p>
      {contenu}
    </div>
  );
}
