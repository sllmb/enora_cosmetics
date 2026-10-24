import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

const VARIANTES = {
  primaire: "tissu-soie text-sur-primaire hover:bg-primaire-survol shadow-carte",
  secondaire: "border border-primaire text-primaire hover:bg-primaire-doux",
  discret: "text-texte hover:bg-surface-douce",
  whatsapp: "bg-whatsapp text-sur-whatsapp hover:bg-whatsapp-survol shadow-carte",
} as const;

const TAILLES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
} as const;

type Style = { variante?: keyof typeof VARIANTES; taille?: keyof typeof TAILLES };

function classesBouton({ variante = "primaire", taille = "md" }: Style, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide whitespace-nowrap",
    "transition-colors duration-220 ease-douce disabled:pointer-events-none disabled:opacity-50",
    VARIANTES[variante],
    TAILLES[taille],
    className,
  );
}

export function Button({
  variante,
  taille,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & Style) {
  return (
    <button type={type} className={classesBouton({ variante, taille }, className)} {...props} />
  );
}

export function ButtonLink({
  variante,
  taille,
  className,
  ...props
}: ComponentProps<typeof Link> & Style) {
  return <Link className={classesBouton({ variante, taille }, className)} {...props} />;
}
