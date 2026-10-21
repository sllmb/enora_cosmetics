import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type Props = Omit<ComponentProps<"button">, "children"> & { libelle: string; children: ReactNode };

/** Bouton icône : le libellé est obligatoire (lu par les lecteurs d'écran). */
export function IconButton({ libelle, className, type = "button", children, ...props }: Props) {
  return (
    <button
      type={type}
      aria-label={libelle}
      title={libelle}
      className={cn(
        "relative inline-flex size-11 items-center justify-center rounded-full text-texte",
        "transition-colors duration-220 hover:bg-surface-douce",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
