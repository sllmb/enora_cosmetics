import { cn } from "@/shared/lib/cn";
import { formaterPrix } from "@/shared/lib/format";

type Props = { prix: number; prixPromo?: number | null; className?: string };

export function Prix({ prix, prixPromo, className }: Props) {
  const enPromo = prixPromo != null && prixPromo < prix;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className={cn("font-medium", enPromo && "text-primaire")}>
        {enPromo && <span className="sr-only">Prix promotionnel : </span>}
        {formaterPrix(enPromo ? prixPromo : prix)}
      </span>
      {enPromo && (
        <s className="text-sm text-texte-attenue">
          <span className="sr-only">Prix habituel : </span>
          {formaterPrix(prix)}
        </s>
      )}
    </p>
  );
}
