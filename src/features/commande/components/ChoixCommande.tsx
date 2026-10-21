import { Banknote, MessageCircle, Smartphone } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/shared/lib/cn";
import { formaterPrix } from "@/shared/lib/format";
import { MODES_PAIEMENT, type ModePaiement } from "../schemas/commande";
import type { ZoneLivraison } from "../types";

const classeCarte = cn(
  "flex cursor-pointer items-start gap-3 rounded-controle border border-bordure bg-surface p-4",
  "transition-colors duration-150 hover:border-primaire",
  "has-[:checked]:border-primaire has-[:checked]:bg-primaire-doux",
  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primaire",
);

function Erreur({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm text-danger">
      {message}
    </p>
  );
}

type PropsZone = {
  zones: ZoneLivraison[];
  register: UseFormRegisterReturn;
  erreur?: string;
};

export function ChoixZone({ zones, register, erreur }: PropsZone) {
  return (
    <div
      role="radiogroup"
      aria-label="Zone de livraison"
      aria-describedby={erreur ? "erreur-zone" : undefined}
      className="flex flex-col gap-2"
    >
      <p className="text-sm font-medium">
        Zone de livraison <span className="text-danger">*</span>
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {zones.map((zone) => (
          <label key={zone.id} className={classeCarte}>
            <input
              type="radio"
              value={String(zone.id)}
              className="mt-1 size-4 accent-primaire"
              {...register}
            />
            <span className="flex flex-1 flex-col">
              <span className="text-sm font-medium">{zone.nom}</span>
              <span className="text-sm text-texte-attenue">
                {formaterPrix(zone.frais)} · {zone.delai}
              </span>
            </span>
          </label>
        ))}
      </div>
      <Erreur id="erreur-zone" message={erreur} />
    </div>
  );
}

const ICONES: Record<ModePaiement, typeof Banknote> = {
  livraison: Banknote,
  wave: Smartphone,
  orange_money: Smartphone,
  whatsapp: MessageCircle,
};

type PropsPaiement = { register: UseFormRegisterReturn; erreur?: string };

export function ChoixModePaiement({ register, erreur }: PropsPaiement) {
  return (
    <div
      role="radiogroup"
      aria-label="Mode de paiement"
      aria-describedby={erreur ? "erreur-paiement" : undefined}
      className="flex flex-col gap-2"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {(
          Object.entries(MODES_PAIEMENT) as [ModePaiement, (typeof MODES_PAIEMENT)[ModePaiement]][]
        ).map(([mode, { libelle, aide }]) => {
          const Icone = ICONES[mode];
          return (
            <label key={mode} className={classeCarte}>
              <input
                type="radio"
                value={mode}
                className="mt-1 size-4 accent-primaire"
                {...register}
              />
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Icone aria-hidden className="size-4 text-primaire" strokeWidth={1.5} />
                  {libelle}
                </span>
                <span className="text-sm text-texte-attenue">{aide}</span>
              </span>
            </label>
          );
        })}
      </div>
      <Erreur id="erreur-paiement" message={erreur} />
    </div>
  );
}
