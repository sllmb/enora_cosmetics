import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { ListeArticlesAdmin } from "@/features/conseils/admin";
import { listerArticlesAdmin } from "@/features/conseils/serveur";
import { ButtonLink } from "@/shared/ui";

export const metadata: Metadata = { title: "Conseils" };

export default function ArticlesAdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <EnteteAdmin
        titre="Conseils"
        description="Les brouillons n'apparaissent pas sur le site."
        action={
          <ButtonLink href="/admin/articles/nouveau">
            <Plus aria-hidden className="size-4" /> Nouvel article
          </ButtonLink>
        }
      />
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Liste />
      </Suspense>
    </div>
  );
}

async function Liste() {
  return <ListeArticlesAdmin articles={await listerArticlesAdmin()} />;
}
