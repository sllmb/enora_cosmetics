import type { ReactNode } from "react";

type Props = { titre: string; description?: string; action?: ReactNode; retour?: ReactNode };

export function EnteteAdmin({ titre, description, action, retour }: Props) {
  return (
    <header className="mb-8 flex flex-col gap-3">
      {retour}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl">{titre}</h1>
          {description && <p className="mt-2 text-texte-attenue">{description}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
