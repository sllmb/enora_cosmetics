"use client";

import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { compresserImage } from "@/shared/lib/image";
import { clientNavigateur } from "@/shared/supabase/navigateur";
import { Button } from "@/shared/ui";
import { definirImageArticle } from "../../actions/conseils";

type Props = { articleId: number; imageUrl: string | null };

/** Image de couverture : une seule par article, remplacée à chaque envoi. */
export function ImageArticle({ articleId, imageUrl }: Props) {
  const router = useRouter();
  const [envoi, demarrer] = useTransition();

  const appliquer = (chemin: string | null, succes: string) =>
    demarrer(async () => {
      const resultat = await definirImageArticle(articleId, chemin);
      if (!resultat.ok) return void toast.error(resultat.message);
      toast.success(succes);
      router.refresh();
    });

  const deposer = (fichier: File | undefined) =>
    fichier &&
    demarrer(async () => {
      try {
        const blob = await compresserImage(fichier);
        const chemin = `articles/${crypto.randomUUID()}.webp`;
        const { error } = await clientNavigateur()
          .storage.from("produits")
          .upload(chemin, blob, { contentType: "image/webp", cacheControl: "31536000" });
        if (error) throw error;
        const resultat = await definirImageArticle(articleId, chemin);
        if (!resultat.ok) throw new Error(resultat.message);
        toast.success("Image enregistrée.");
        router.refresh();
      } catch {
        toast.error("L'image n'a pas pu être envoyée.");
      }
    });

  return (
    <div className="flex flex-col gap-3">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Image de couverture"
          width={800}
          height={500}
          className="aspect-[16/10] w-full rounded-controle object-cover"
        />
      )}
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-primaire px-4 text-sm text-primaire hover:bg-primaire-doux has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primaire">
          <ImagePlus aria-hidden className="size-4" />
          {envoi ? "Envoi…" : imageUrl ? "Remplacer l'image" : "Ajouter une image"}
          <input
            type="file"
            accept="image/*"
            disabled={envoi}
            className="sr-only"
            onChange={(e) => {
              deposer(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        {imageUrl && (
          <Button
            taille="sm"
            variante="discret"
            disabled={envoi}
            onClick={() => appliquer(null, "Image retirée.")}
          >
            Retirer l&apos;image
          </Button>
        )}
      </div>
    </div>
  );
}
