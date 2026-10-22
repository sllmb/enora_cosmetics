import { Star } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { formaterNote } from "../lib/avis";

type Props = { note: number; taille?: "sm" | "md"; className?: string };

/** Note affichée en étoiles (arrondie à la demi-étoile près visuellement). */
export function Etoiles({ note, taille = "sm", className }: Props) {
  const classe = taille === "sm" ? "size-4" : "size-5";
  return (
    <span
      role="img"
      aria-label={`Note : ${formaterNote(note)} sur 5`}
      className={cn("inline-flex items-center gap-0.5 text-accent", className)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(classe, i <= Math.round(note) ? "fill-accent" : "fill-transparent")}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
