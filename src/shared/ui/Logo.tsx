import Image from "next/image";
import logoCompletBlanc from "../../../public/brand/logo-enora-blanc.png";
import logoComplet from "../../../public/brand/logo-enora.png";
import wordmarkBlanc from "../../../public/brand/wordmark-enora-blanc.png";
import wordmark from "../../../public/brand/wordmark-enora.png";
import { cn } from "@/shared/lib/cn";

type Props = {
  /** « wordmark » = ÉNORA seul (en-tête) ; « complet » = avec COSMETICS. */
  forme?: "wordmark" | "complet";
  clair?: boolean;
  className?: string;
  priority?: boolean;
};

const SOURCES = {
  wordmark: { fonce: wordmark, clair: wordmarkBlanc },
  complet: { fonce: logoComplet, clair: logoCompletBlanc },
} as const;

export function Logo({ forme = "wordmark", clair = false, className, priority }: Props) {
  return (
    <Image
      src={SOURCES[forme][clair ? "clair" : "fonce"]}
      alt="Énora Cosmetics"
      priority={priority}
      className={cn("h-auto", className)}
      sizes="(max-width: 768px) 160px, 320px"
    />
  );
}
