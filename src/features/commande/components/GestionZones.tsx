"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge, Button, DialogueConfirmation, FormField, Input } from "@/shared/ui";
import { enregistrerZone, supprimerZone } from "../actions/admin";
import { zoneAdminSchema, type ZoneAdminSaisie } from "../schemas/commande";

export type ZoneAdmin = {
  id: number;
  nom: string;
  frais: number;
  delai: string;
  ordre: number;
  active: boolean;
};

export function GestionZones({ zones }: { zones: ZoneAdmin[] }) {
  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-4">
        {zones.map((zone) => (
          <li key={zone.id} className="rounded-carte border border-bordure bg-surface p-6">
            {!zone.active && (
              <Badge ton="avertissement" className="mb-3">
                Masquée
              </Badge>
            )}
            <FicheZone zone={zone} />
          </li>
        ))}
      </ul>
      <section className="rounded-carte border-2 border-dashed border-bordure-forte p-6">
        <h2 className="mb-4 text-2xl">Nouvelle zone</h2>
        <FicheZone ordreSuivant={(zones.at(-1)?.ordre ?? 0) + 1} />
      </section>
    </div>
  );
}

function FicheZone({ zone, ordreSuivant = 1 }: { zone?: ZoneAdmin; ordreSuivant?: number }) {
  const router = useRouter();
  const [envoi, demarrer] = useTransition();
  const { register, handleSubmit, reset, formState } = useForm<ZoneAdminSaisie>({
    resolver: zodResolver(zoneAdminSchema),
    defaultValues: {
      nom: zone?.nom ?? "",
      frais: zone ? String(zone.frais) : "",
      delai: zone?.delai ?? "",
      ordre: String(zone?.ordre ?? ordreSuivant),
      active: zone?.active ?? true,
    },
  });
  const { errors } = formState;

  const envoyer = handleSubmit((valeurs) =>
    demarrer(async () => {
      const resultat = await enregistrerZone(zone?.id ?? null, valeurs);
      if (!resultat.ok) return void toast.error(resultat.message);
      toast.success(zone ? "Zone enregistrée." : "Zone ajoutée.");
      if (!zone) reset();
      router.refresh();
    }),
  );

  return (
    <form method="post" onSubmit={envoyer} noValidate className="flex flex-col gap-4">
      <FormField libelle="Nom de la zone" obligatoire erreur={errors.nom?.message}>
        <Input {...register("nom")} />
      </FormField>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-[1fr_1fr_6rem]">
        <FormField libelle="Frais (FCFA)" obligatoire erreur={errors.frais?.message}>
          <Input inputMode="numeric" {...register("frais")} />
        </FormField>
        <FormField libelle="Délai" obligatoire aide="Ex. : 24 h" erreur={errors.delai?.message}>
          <Input {...register("delai")} />
        </FormField>
        <FormField libelle="Ordre" erreur={errors.ordre?.message}>
          <Input inputMode="numeric" {...register("ordre")} />
        </FormField>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primaire" {...register("active")} />
          Proposée aux clientes
        </label>
        <div className="flex gap-2">
          {zone && (
            <DialogueConfirmation
              declencheur={
                <Button variante="discret" taille="sm" disabled={envoi} className="text-danger">
                  Supprimer
                </Button>
              }
              titre={`Supprimer « ${zone.nom} » ?`}
              description="Les commandes passées gardent le nom et les frais de la zone. Pour la retirer temporairement, décochez plutôt « Proposée aux clientes »."
              libelleConfirmer="Supprimer"
              onConfirmer={() =>
                demarrer(async () => {
                  const resultat = await supprimerZone(zone.id);
                  if (!resultat.ok) return void toast.error(resultat.message);
                  toast.success("Zone supprimée.");
                  router.refresh();
                })
              }
            />
          )}
          <Button type="submit" taille="sm" disabled={envoi}>
            {zone ? "Enregistrer" : "Ajouter"}
          </Button>
        </div>
      </div>
    </form>
  );
}
