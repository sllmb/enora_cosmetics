import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-controle border border-bordure-forte bg-surface px-4 text-base text-texte",
        "placeholder:text-texte-attenue aria-invalid:border-danger",
        "transition-colors duration-150 focus-visible:border-primaire",
        className,
      )}
      {...props}
    />
  );
}
