import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

const TONS = {
  neutre: "bg-surface-douce text-texte",
  primaire: "tissu-soie text-sur-primaire",
  doux: "bg-primaire-doux text-primaire",
  succes: "bg-succes-doux text-succes",
  danger: "bg-danger-doux text-danger",
  avertissement: "bg-avertissement-doux text-avertissement",
} as const;

type Props = { ton?: keyof typeof TONS; className?: string; children: ReactNode };

export function Badge({ ton = "neutre", className, children }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        TONS[ton],
        className,
      )}
    >
      {children}
    </span>
  );
}
