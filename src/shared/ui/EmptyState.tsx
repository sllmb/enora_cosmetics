import type { ReactNode } from "react";

type Props = { icone?: ReactNode; titre: string; description?: string; action?: ReactNode };

export function EmptyState({ icone, titre, description, action }: Props) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      {icone && (
        <div
          aria-hidden
          className="flex size-16 items-center justify-center rounded-full bg-primaire-doux text-primaire"
        >
          {icone}
        </div>
      )}
      <h2 className="text-3xl">{titre}</h2>
      {description && <p className="text-texte-attenue">{description}</p>}
      {action}
    </div>
  );
}
