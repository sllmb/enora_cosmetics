import { Check, ChevronDown } from "lucide-react";
import { useId } from "react";
import { cn } from "@/shared/lib/cn";
import { SELECTION_PAR_DEFAUT, TRIS, type Selection, type Tri } from "../lib/filtres";
import { LIBELLES_FAMILLE } from "../lib/produit";
import type { FamilleOlfactive } from "../types";

type Props = {
  selection: Selection;
  familles: FamilleOlfactive[];
  nombre: string;
  /** Absent pendant le rendu pré-calculé : les contrôles sont alors inactifs. */
  changer?: (selection: Selection) => void;
};

export function BarreFiltres({ selection, familles, nombre, changer }: Props) {
  const idTri = useId();
  const inactif = !changer;
  const modifie =
    selection.familles.length > 0 ||
    selection.disponiblesSeulement ||
    selection.tri !== SELECTION_PAR_DEFAUT.tri;

  const basculerFamille = (famille: FamilleOlfactive) =>
    changer?.({
      ...selection,
      familles: selection.familles.includes(famille)
        ? selection.familles.filter((f) => f !== famille)
        : [...selection.familles, famille],
    });

  return (
    <section
      aria-label="Trier et filtrer"
      className="flex flex-col gap-4 border-y border-bordure py-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-texte-attenue">
          {nombre}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor={idTri} className="text-sm text-texte-attenue">
            Trier par
          </label>
          <div className="relative">
            <select
              id={idTri}
              value={selection.tri}
              disabled={inactif}
              onChange={(e) => changer?.({ ...selection, tri: e.target.value as Tri })}
              className="h-10 appearance-none rounded-full border border-bordure-forte bg-surface pr-9 pl-4 text-sm"
            >
              {Object.entries(TRIS).map(([valeur, libelle]) => (
                <option key={valeur} value={valeur}>
                  {libelle}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-texte-attenue"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {familles.length > 1 && (
          <div role="group" aria-label="Famille olfactive" className="flex flex-wrap gap-2">
            {familles.map((famille) => {
              const actif = selection.familles.includes(famille);
              return (
                <button
                  key={famille}
                  type="button"
                  aria-pressed={actif}
                  disabled={inactif}
                  onClick={() => basculerFamille(famille)}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors duration-150",
                    actif
                      ? "border-primaire bg-primaire-doux text-primaire"
                      : "border-bordure hover:border-primaire",
                  )}
                >
                  {actif && <Check aria-hidden className="size-3.5" />}
                  {LIBELLES_FAMILLE[famille]}
                </button>
              );
            })}
          </div>
        )}
        <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={selection.disponiblesSeulement}
            disabled={inactif}
            onChange={(e) => changer?.({ ...selection, disponiblesSeulement: e.target.checked })}
            className="size-4 accent-primaire"
          />
          Disponibles uniquement
        </label>
        {modifie && (
          <button
            type="button"
            onClick={() => changer?.(SELECTION_PAR_DEFAUT)}
            className="text-sm text-primaire underline-offset-4 hover:underline"
          >
            Tout effacer
          </button>
        )}
      </div>
    </section>
  );
}
