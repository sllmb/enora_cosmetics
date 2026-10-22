import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/shared/ui";

type Props = { titre: string; description?: string; sprint: string };

/**
 * Remplace une page pas encore développée : toutes les adresses existent
 * dès le socle (vision complète, aucun lien mort), puis sont remplacées sprint après sprint.
 * Le sprint prévu reste dans le code (data-sprint), jamais affiché aux visiteurs.
 */
export function PageAVenir({ titre, description, sprint }: Props) {
  return (
    <div
      data-sprint={sprint}
      className="conteneur mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center"
    >
      <div
        aria-hidden
        className="flex size-16 items-center justify-center rounded-full bg-primaire-doux text-primaire"
      >
        <Sparkles className="size-7" strokeWidth={1.5} />
      </div>
      <p className="titre-espace text-texte-attenue">Bientôt disponible</p>
      <h1 className="text-4xl">{titre}</h1>
      <p className="text-texte-attenue">
        {description ?? "Cette page est en cours de préparation."}
      </p>
      <ButtonLink href="/" variante="secondaire">
        Retour à l&apos;accueil
      </ButtonLink>
    </div>
  );
}
