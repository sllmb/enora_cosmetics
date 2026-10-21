"use client";

import { RefreshCw } from "lucide-react";
import { Button, EmptyState } from "@/shared/ui";

export default function ErreurPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="contenu" className="conteneur flex flex-1 items-center justify-center py-16">
      <EmptyState
        icone={<RefreshCw className="size-7" strokeWidth={1.5} />}
        titre="Un souci est survenu"
        description="La page n'a pas pu s'afficher. Réessayez dans un instant."
        action={<Button onClick={reset}>Réessayer</Button>}
      />
    </main>
  );
}
