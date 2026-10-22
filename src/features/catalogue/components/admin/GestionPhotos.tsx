"use client";

import { ImagePlus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { compresserImage } from "@/shared/lib/image";
import { clientNavigateur } from "@/shared/supabase/navigateur";
import { Badge, DialogueConfirmation, IconButton } from "@/shared/ui";
import {
  ajouterImage,
  definirImagePrincipale,
  supprimerImage,
  type ResultatCatalogue,
} from "../../actions/admin";
import type { ImageAdmin } from "../../queries/admin";

type Props = { produitId: number; nomProduit: string; images: ImageAdmin[] };

const TAILLE_MAX = 15 * 1024 * 1024; // avant compression

export function GestionPhotos({ produitId, nomProduit, images }: Props) {
  const router = useRouter();
  const [envoi, demarrer] = useTransition();

  const executer = (action: () => Promise<ResultatCatalogue>, succes: string) =>
    demarrer(async () => {
      const resultat = await action();
      if (resultat.ok) {
        toast.success(succes);
        router.refresh();
      } else toast.error(resultat.message);
    });

  const deposer = (fichiers: FileList | null) =>
    demarrer(async () => {
      const liste = [...(fichiers ?? [])].filter((f) => f.type.startsWith("image/"));
      let ajoutees = 0;
      for (const fichier of liste) {
        if (fichier.size > TAILLE_MAX) {
          toast.error(`${fichier.name} dépasse 15 Mo.`);
          continue;
        }
        try {
          const blob = await compresserImage(fichier);
          // Dépôt direct dans le Storage : la règle du bucket n'accepte que les administrateurs.
          const chemin = `${produitId}/${crypto.randomUUID()}.webp`;
          const { error } = await clientNavigateur()
            .storage.from("produits")
            .upload(chemin, blob, { contentType: "image/webp", cacheControl: "31536000" });
          if (error) throw error;
          const resultat = await ajouterImage({ produitId, chemin, alt: nomProduit });
          if (!resultat.ok) throw new Error(resultat.message);
          ajoutees++;
        } catch {
          toast.error(`${fichier.name} n'a pas pu être envoyée.`);
        }
      }
      if (ajoutees) {
        toast.success(ajoutees > 1 ? `${ajoutees} photos ajoutées.` : "Photo ajoutée.");
        router.refresh();
      }
    });

  return (
    <div className="flex flex-col gap-4">
      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="relative overflow-hidden rounded-controle border border-bordure bg-surface-douce"
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={300}
                height={300}
                // Comme sur le site : produit entier, jamais recadré.
                className="aspect-square w-full object-contain p-[8%] mix-blend-multiply"
              />
              {index === 0 && (
                <Badge ton="primaire" className="absolute top-2 left-2">
                  Principale
                </Badge>
              )}
              <div className="absolute right-1 bottom-1 flex gap-1 rounded-full bg-surface/90">
                {index > 0 && (
                  <IconButton
                    libelle="Définir comme photo principale"
                    disabled={envoi}
                    onClick={() =>
                      executer(() => definirImagePrincipale(image.id), "Photo principale changée.")
                    }
                  >
                    <Star aria-hidden className="size-4" />
                  </IconButton>
                )}
                <DialogueConfirmation
                  declencheur={
                    <IconButton libelle="Supprimer la photo" disabled={envoi}>
                      <Trash2 aria-hidden className="size-4 text-danger" />
                    </IconButton>
                  }
                  titre="Supprimer cette photo ?"
                  description="Elle disparaît de la boutique. Cette action est définitive."
                  libelleConfirmer="Supprimer"
                  onConfirmer={() => executer(() => supprimerImage(image.id), "Photo supprimée.")}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-texte-attenue">
          Aucune photo : la boutique affiche une illustration en attendant.
        </p>
      )}

      <label
        className="flex cursor-pointer flex-col items-center gap-2 rounded-controle border-2 border-dashed border-bordure-forte p-6 text-center text-sm hover:border-primaire has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primaire"
        aria-busy={envoi}
      >
        <ImagePlus aria-hidden className="size-6 text-primaire" strokeWidth={1.5} />
        <span className="font-medium">{envoi ? "Envoi en cours…" : "Ajouter des photos"}</span>
        <span className="text-texte-attenue">
          JPG, PNG ou WebP. Réduites automatiquement avant l&apos;envoi.
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={envoi}
          className="sr-only"
          onChange={(e) => {
            deposer(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
