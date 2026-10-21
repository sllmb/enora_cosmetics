import { Badge } from "@/shared/ui";
import { estEpuise, pourcentageRemise } from "../lib/produit";
import type { Produit } from "../types";

type Props = { produit: Pick<Produit, "prix" | "prixPromo" | "stock" | "estNouveaute"> };

export function BadgesProduit({ produit }: Props) {
  const remise = pourcentageRemise(produit);
  const epuise = estEpuise(produit);
  if (!epuise && !remise && !produit.estNouveaute) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {epuise && <Badge>Épuisé</Badge>}
      {!epuise && remise > 0 && <Badge ton="primaire">−{remise} %</Badge>}
      {produit.estNouveaute && <Badge ton="doux">Nouveau</Badge>}
    </div>
  );
}
