import { cloneElement, useId, type ReactElement } from "react";

type ChampProps = { id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string };

type Props = {
  libelle: string;
  erreur?: string;
  aide?: string;
  obligatoire?: boolean;
  children: ReactElement<ChampProps>;
};

/** Relie libellé, aide et message d'erreur au champ (accessibilité). */
export function FormField({ libelle, erreur, aide, obligatoire, children }: Props) {
  const id = useId();
  const idAide = aide ? `${id}-aide` : undefined;
  const idErreur = erreur ? `${id}-erreur` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {libelle}
        {obligatoire && <span className="text-danger"> *</span>}
      </label>
      {cloneElement(children, {
        id,
        "aria-invalid": erreur ? true : undefined,
        "aria-describedby": [idAide, idErreur].filter(Boolean).join(" ") || undefined,
      })}
      {aide && (
        <p id={idAide} className="text-sm text-texte-attenue">
          {aide}
        </p>
      )}
      {erreur && (
        <p id={idErreur} role="alert" className="text-sm text-danger">
          {erreur}
        </p>
      )}
    </div>
  );
}
