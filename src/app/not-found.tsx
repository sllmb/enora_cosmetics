import { Search } from "lucide-react";
import Link from "next/link";
import { ButtonLink, EmptyState, Logo } from "@/shared/ui";

export default function NotFound() {
  return (
    <main id="contenu" className="conteneur flex flex-1 flex-col items-center justify-center py-16">
      <Link href="/" aria-label="Énora Cosmetics, accueil">
        <Logo className="w-32" />
      </Link>
      <EmptyState
        icone={<Search className="size-7" strokeWidth={1.5} />}
        titre="Page introuvable"
        description="Cette page n'existe pas ou a été déplacée."
        action={<ButtonLink href="/boutique">Voir la boutique</ButtonLink>}
      />
    </main>
  );
}
