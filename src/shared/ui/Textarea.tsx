import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

export function Textarea({ className, rows = 3, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-controle border border-bordure-forte bg-surface px-4 py-3 text-base text-texte",
        "placeholder:text-texte-attenue aria-invalid:border-danger",
        "transition-colors duration-150 focus-visible:border-primaire",
        className,
      )}
      {...props}
    />
  );
}
