import { Sparkles } from "lucide-react";
import { ButtonLink, EmptyState } from "@/shared/ui";

type Props = { titre: string; description?: string; sprint: string };

/**
 * Remplace une page pas encore développée : toutes les adresses existent
 * dès le socle (vision complète, aucun lien mort), puis sont remplacées sprint après sprint.
 */
export function PageAVenir({ titre, description, sprint }: Props) {
  return (
    <div className="conteneur py-12">
      <p className="text-center titre-espace text-texte-attenue">Bientôt disponible</p>
      <EmptyState
        icone={<Sparkles className="size-7" strokeWidth={1.5} />}
        titre={titre}
        description={description ?? "Cette page est en cours de préparation."}
        action={
          <ButtonLink href="/" variante="secondaire">
            Retour à l&apos;accueil
          </ButtonLink>
        }
      />
      <p className="text-center text-xs text-texte-attenue" data-sprint={sprint}>
        {sprint}
      </p>
    </div>
  );
}
