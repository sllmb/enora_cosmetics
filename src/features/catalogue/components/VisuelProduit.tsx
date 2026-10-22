import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import type { FamilleOlfactive, FormeVisuel, Produit } from "../types";

const TEINTES: Record<FamilleOlfactive, string> = {
  floral: "fill-teinte-floral",
  oriental: "fill-teinte-oriental",
  frais: "fill-teinte-frais",
  musque: "fill-teinte-musque",
  gourmand: "fill-teinte-gourmand",
  boise: "fill-teinte-boise",
};

type Props = {
  produit: Pick<Produit, "nom" | "forme" | "familleOlfactive" | "images">;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Photo du produit si elle existe, sinon une illustration de sa forme
 * (stick, spray, flacon, savon) teintée selon sa famille olfactive.
 * La photo est montrée en entier (jamais recadrée ni agrandie), centrée avec
 * une marge ; un fond blanc se fond dans le fond doux du cadre (multiply), et
 * une photo détourée (fond transparent) s'y pose naturellement.
 */
export function VisuelProduit({ produit, className, sizes, priority }: Props) {
  const photo = produit.images[0];
  return (
    <div className={cn("relative aspect-square overflow-hidden bg-surface-douce", className)}>
      {photo ? (
        <Image
          src={photo.url}
          alt={photo.alt || produit.nom}
          fill
          sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
          priority={priority}
          className="object-contain p-[8%] mix-blend-multiply"
        />
      ) : (
        <Illustration
          forme={produit.forme}
          teinte={TEINTES[produit.familleOlfactive ?? "musque"]}
          nom={produit.nom}
        />
      )}
    </div>
  );
}

function Illustration({ forme, teinte, nom }: { forme: FormeVisuel; teinte: string; nom: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Illustration : ${nom}`}
      className="size-full"
    >
      <ellipse cx="100" cy="176" rx="52" ry="7" className="fill-texte/[0.07]" />
      {forme === "stick" && <Stick teinte={teinte} />}
      {forme === "spray" && <Spray teinte={teinte} />}
      {forme === "flacon" && <Flacon teinte={teinte} />}
      {forme === "savon" && <Savon teinte={teinte} />}
    </svg>
  );
}

function Etiquette({ y }: { y: number }) {
  return (
    <text
      x="100"
      y={y}
      textAnchor="middle"
      className="fill-primaire font-titre text-[13px] tracking-[0.2em]"
    >
      ÉNORA
    </text>
  );
}

function Stick({ teinte }: { teinte: string }) {
  return (
    <g>
      <rect x="74" y="36" width="52" height="46" rx="14" className={teinte} />
      <rect x="70" y="78" width="60" height="96" rx="16" className="fill-surface stroke-bordure" />
      <rect x="70" y="78" width="60" height="8" className="fill-texte/[0.04]" />
      <Etiquette y={132} />
    </g>
  );
}

function Spray({ teinte }: { teinte: string }) {
  return (
    <g>
      <rect x="93" y="26" width="14" height="14" rx="3" className="fill-primaire" />
      <rect x="80" y="38" width="40" height="30" rx="8" className={teinte} />
      <rect x="72" y="64" width="56" height="110" rx="12" className="fill-surface stroke-bordure" />
      <Etiquette y={124} />
    </g>
  );
}

function Flacon({ teinte }: { teinte: string }) {
  return (
    <g>
      <rect x="85" y="34" width="30" height="30" rx="7" className="fill-primaire" />
      <rect x="92" y="62" width="16" height="12" className="fill-surface stroke-bordure" />
      <rect x="62" y="72" width="76" height="102" rx="16" className="fill-surface stroke-bordure" />
      <rect x="68" y="104" width="64" height="64" rx="11" className={cn(teinte, "opacity-80")} />
      <rect x="62" y="82" width="76" height="20" className="fill-surface/70" />
      <Etiquette y={97} />
    </g>
  );
}

function Savon({ teinte }: { teinte: string }) {
  return (
    <g>
      <rect x="38" y="88" width="124" height="80" rx="38" className={cn(teinte, "opacity-60")} />
      <rect x="38" y="80" width="124" height="80" rx="38" className={teinte} />
      <rect x="58" y="90" width="84" height="18" rx="9" className="fill-surface/40" />
      <text
        x="100"
        y="136"
        textAnchor="middle"
        className="fill-primaire/45 font-titre text-[22px] tracking-[0.25em]"
      >
        ÉNORA
      </text>
    </g>
  );
}
