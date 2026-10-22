"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { Produit } from "@/features/catalogue";
import { detaillerPanier, usePanier } from "@/features/panier";
import { formaterPrix } from "@/shared/lib/format";
import { Button, ButtonLink, EmptyState, FormField, Input, Textarea } from "@/shared/ui";
import { creerCommande } from "../actions/creerCommande";
import { coordonneesSchema, type Coordonnees, type CoordonneesSaisies } from "../schemas/commande";
import type { ZoneLivraison } from "../types";
import { ChoixModePaiement, ChoixZone } from "./ChoixCommande";

type Props = {
  produits: Produit[];
  zones: ZoneLivraison[];
  /** Coordonnées du profil de la cliente connectée. */
  valeursInitiales?: Partial<CoordonneesSaisies>;
};

export function FormulaireCommande({ produits, zones, valeursInitiales }: Props) {
  const router = useRouter();
  const panier = usePanier();
  const [envoi, demarrer] = useTransition();
  const [redirection, setRedirection] = useState(false);
  const [erreurGenerale, setErreurGenerale] = useState<{ message: string; panier: boolean }>();

  const formulaire = useForm<CoordonneesSaisies, unknown, Coordonnees>({
    resolver: zodResolver(coordonneesSchema),
    defaultValues: {
      nom: "",
      telephone: "",
      email: "",
      adresse: "",
      note: "",
      siteWeb: "",
      ...valeursInitiales,
    },
  });
  const { register, handleSubmit, setError, getValues, control, formState } = formulaire;
  const zoneChoisie = useWatch({ control, name: "zoneId" });
  const { errors } = formState;

  if (!panier.pret || redirection) {
    return <div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />;
  }

  const detail = detaillerPanier(panier.lignes, produits);
  if (detail.lignes.length === 0) {
    return (
      <EmptyState
        icone={<ShoppingBag className="size-7" strokeWidth={1.5} />}
        titre="Votre panier est vide"
        description="Ajoutez des produits avant de passer commande."
        action={<ButtonLink href="/boutique">Découvrir la boutique</ButtonLink>}
      />
    );
  }

  const zone = zones.find((z) => String(z.id) === String(zoneChoisie));
  const total = detail.sousTotal + (zone?.frais ?? 0);

  const envoyer = handleSubmit(() =>
    demarrer(async () => {
      setErreurGenerale(undefined);
      // Le serveur revalide la saisie brute (et non la version déjà transformée ici).
      const resultat = await creerCommande(getValues(), panier.lignes);
      if (resultat.ok) {
        setRedirection(true);
        panier.vider();
        router.push(
          `/commande/confirmation/${resultat.reference}?cle=${encodeURIComponent(resultat.cle)}`,
        );
        return;
      }
      for (const [champ, message] of Object.entries(resultat.erreurs ?? {})) {
        if (message) setError(champ as keyof CoordonneesSaisies, { message });
      }
      setErreurGenerale({ message: resultat.message, panier: Boolean(resultat.produit) });
    }),
  );

  return (
    <form
      onSubmit={envoyer}
      method="post"
      noValidate
      className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start"
    >
      <div className="flex flex-col gap-10">
        {erreurGenerale && (
          <div role="alert" className="rounded-carte bg-danger-doux p-4 text-sm text-danger">
            {erreurGenerale.message}{" "}
            {erreurGenerale.panier && (
              <Link href="/panier" className="font-medium underline">
                Vérifier mon panier
              </Link>
            )}
          </div>
        )}

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 font-titre text-3xl">1. Vos coordonnées</legend>
          <FormField libelle="Nom complet" obligatoire erreur={errors.nom?.message}>
            <Input autoComplete="name" {...register("nom")} />
          </FormField>
          <FormField
            libelle="Téléphone"
            obligatoire
            aide="Le livreur vous appelle sur ce numéro."
            erreur={errors.telephone?.message}
          >
            <Input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="77 123 45 67"
              {...register("telephone")}
            />
          </FormField>
          <FormField
            libelle="Email (facultatif)"
            aide="Pour recevoir le récapitulatif."
            erreur={errors.email?.message}
          >
            <Input type="email" autoComplete="email" {...register("email")} />
          </FormField>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 font-titre text-3xl">2. Livraison</legend>
          <ChoixZone zones={zones} register={register("zoneId")} erreur={errors.zoneId?.message} />
          <FormField
            libelle="Adresse de livraison"
            obligatoire
            aide="Quartier, rue, point de repère : tout ce qui aide le livreur."
            erreur={errors.adresse?.message}
          >
            <Textarea autoComplete="street-address" {...register("adresse")} />
          </FormField>
          <FormField libelle="Note pour la livraison (facultatif)" erreur={errors.note?.message}>
            <Textarea rows={2} placeholder="Ex. : appeler avant de passer" {...register("note")} />
          </FormField>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 font-titre text-3xl">3. Paiement</legend>
          <ChoixModePaiement
            register={register("modePaiement")}
            erreur={errors.modePaiement?.message}
          />
        </fieldset>

        {/* Piège à robots : invisible et ignoré par les personnes. */}
        <div aria-hidden className="absolute -left-[9999px]">
          <label>
            Site web
            <input tabIndex={-1} autoComplete="off" {...register("siteWeb")} />
          </label>
        </div>
      </div>

      <aside
        aria-label="Récapitulatif de la commande"
        className="flex flex-col gap-4 rounded-carte bg-surface-douce p-6 lg:sticky lg:top-28"
      >
        <h2 className="text-2xl">Votre commande</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {detail.lignes.map((ligne) => (
            <li key={ligne.slug} className="flex justify-between gap-3">
              <span>
                {ligne.produit?.nom ?? "Produit indisponible"} × {ligne.quantite}
              </span>
              <span className="shrink-0 font-medium">
                {ligne.probleme ? "—" : formaterPrix(ligne.total)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-2 border-t border-bordure pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Sous-total</dt>
            <dd>{formaterPrix(detail.sousTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Livraison</dt>
            <dd>{zone ? formaterPrix(zone.frais) : "Choisissez une zone"}</dd>
          </div>
          <div className="flex justify-between border-t border-bordure pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd>{formaterPrix(total)}</dd>
          </div>
        </dl>
        {detail.commandable ? (
          <Button type="submit" taille="lg" disabled={envoi} className="w-full">
            {envoi ? "Envoi…" : "Valider la commande"}
          </Button>
        ) : (
          <p role="status" className="text-sm text-danger">
            Un produit de votre panier pose problème.{" "}
            <Link href="/panier" className="font-medium underline">
              Corriger mon panier
            </Link>
          </p>
        )}
        <p className="text-xs text-texte-attenue">
          Rien n&apos;est débité maintenant. Le total est confirmé par nos soins au moment de la
          commande.
        </p>
      </aside>
    </form>
  );
}
