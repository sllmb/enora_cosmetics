"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEstPret } from "@/shared/lib/useEstPret";
import { Button, FormField, Input, Textarea } from "@/shared/ui";
import { enregistrerProduit } from "../../actions/admin";
import { LIBELLES_FAMILLE } from "../../lib/produit";
import type { ProduitAdmin } from "../../queries/admin";
import {
  produitAdminSchema,
  type ProduitAdminSaisi,
  type ProduitAdminValide,
} from "../../schemas/admin";

type Props = {
  produit?: ProduitAdmin;
  categories: { id: number; nom: string }[];
};

const classeSelect =
  "h-11 w-full rounded-controle border border-bordure-forte bg-surface px-4 text-base";

function Bloc({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-carte border border-bordure bg-surface p-6">
      <legend className="px-1 font-titre text-2xl">{titre}</legend>
      {children}
    </fieldset>
  );
}

export function FormulaireProduit({ produit, categories }: Props) {
  const router = useRouter();
  const pret = useEstPret();
  const [envoi, demarrer] = useTransition();
  const { register, handleSubmit, setError, formState } = useForm<
    ProduitAdminSaisi,
    unknown,
    ProduitAdminValide
  >({
    resolver: zodResolver(produitAdminSchema),
    defaultValues: {
      nom: produit?.nom ?? "",
      categorieId: produit ? String(produit.categorieId) : "",
      accroche: produit?.accroche ?? "",
      contenance: produit?.contenance ?? "",
      prix: produit ? String(produit.prix) : "",
      prixPromo: produit?.prixPromo ? String(produit.prixPromo) : "",
      stock: produit ? String(produit.stock) : "0",
      description: produit?.description ?? "",
      conseilsUtilisation: produit?.conseilsUtilisation ?? "",
      composition: produit?.composition ?? "",
      familleOlfactive: produit?.familleOlfactive ?? "",
      notesTete: produit?.notesOlfactives?.tete.join(", ") ?? "",
      notesCoeur: produit?.notesOlfactives?.coeur.join(", ") ?? "",
      notesFond: produit?.notesOlfactives?.fond.join(", ") ?? "",
      estNouveaute: produit?.estNouveaute ?? true,
      actif: produit?.actif ?? true,
    },
  });
  const { errors } = formState;

  const envoyer = handleSubmit((valeurs) =>
    demarrer(async () => {
      const resultat = await enregistrerProduit(produit?.id ?? null, valeurs);
      if (!resultat.ok) {
        for (const [champ, message] of Object.entries(resultat.erreurs ?? {})) {
          if (message) setError(champ as keyof ProduitAdminSaisi, { message });
        }
        toast.error(resultat.message);
        return;
      }
      toast.success(
        produit ? "Produit enregistré." : "Produit créé. Ajoutez maintenant ses photos.",
      );
      if (produit) router.refresh();
      else router.push(`/admin/produits/${resultat.id}`);
    }),
  );

  return (
    <form method="post" onSubmit={envoyer} noValidate className="flex flex-col gap-6">
      <Bloc titre="Informations">
        <FormField libelle="Nom" obligatoire erreur={errors.nom?.message}>
          <Input {...register("nom")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField libelle="Catégorie" obligatoire erreur={errors.categorieId?.message}>
            <select className={classeSelect} {...register("categorieId")}>
              <option value="">— Choisir —</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.nom}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            libelle="Contenance"
            aide="Ex. : 50 ml, 100 g"
            erreur={errors.contenance?.message}
          >
            <Input {...register("contenance")} />
          </FormField>
        </div>
        <FormField
          libelle="Accroche"
          aide="Une phrase courte sous le nom."
          erreur={errors.accroche?.message}
        >
          <Input {...register("accroche")} />
        </FormField>
      </Bloc>

      <Bloc titre="Prix et stock">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField libelle="Prix (FCFA)" obligatoire erreur={errors.prix?.message}>
            <Input inputMode="numeric" {...register("prix")} />
          </FormField>
          <FormField
            libelle="Prix promo (FCFA)"
            aide="Vide = pas de promotion"
            erreur={errors.prixPromo?.message}
          >
            <Input inputMode="numeric" {...register("prixPromo")} />
          </FormField>
          <FormField libelle="Stock" obligatoire erreur={errors.stock?.message}>
            <Input inputMode="numeric" {...register("stock")} />
          </FormField>
        </div>
      </Bloc>

      <Bloc titre="Textes de la fiche">
        <FormField libelle="Description" erreur={errors.description?.message}>
          <Textarea rows={4} {...register("description")} />
        </FormField>
        <FormField libelle="Conseils d'utilisation" erreur={errors.conseilsUtilisation?.message}>
          <Textarea {...register("conseilsUtilisation")} />
        </FormField>
        <FormField libelle="Composition" erreur={errors.composition?.message}>
          <Textarea {...register("composition")} />
        </FormField>
      </Bloc>

      <Bloc titre="Parfum">
        <FormField
          libelle="Famille olfactive"
          aide="Sert au filtre de la boutique."
          erreur={errors.familleOlfactive?.message}
        >
          <select className={classeSelect} {...register("familleOlfactive")}>
            <option value="">— Aucune —</option>
            {Object.entries(LIBELLES_FAMILLE).map(([valeur, libelle]) => (
              <option key={valeur} value={valeur}>
                {libelle}
              </option>
            ))}
          </select>
        </FormField>
        <p className="text-sm text-texte-attenue">
          Notes olfactives (huiles parfumées) : séparées par des virgules, ex. « Bergamote, Rose ».
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField libelle="Notes de tête">
            <Input {...register("notesTete")} />
          </FormField>
          <FormField libelle="Notes de cœur">
            <Input {...register("notesCoeur")} />
          </FormField>
          <FormField libelle="Notes de fond">
            <Input {...register("notesFond")} />
          </FormField>
        </div>
      </Bloc>

      <Bloc titre="Visibilité">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-0.5 size-4 accent-primaire" {...register("actif")} />
          <span>
            <span className="font-medium">Visible dans la boutique</span>
            <span className="block text-texte-attenue">
              Décochez pour retirer le produit sans le supprimer.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-primaire"
            {...register("estNouveaute")}
          />
          <span>
            <span className="font-medium">Nouveauté</span>
            <span className="block text-texte-attenue">
              Badge « Nouveau » et mise en avant sur l&apos;accueil.
            </span>
          </span>
        </label>
      </Bloc>

      <div className="sticky bottom-0 -mx-4 flex justify-end border-t border-bordure bg-fond/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-carte sm:border">
        <Button type="submit" taille="lg" disabled={envoi || !pret}>
          {envoi ? "Enregistrement…" : produit ? "Enregistrer" : "Créer le produit"}
        </Button>
      </div>
    </form>
  );
}
