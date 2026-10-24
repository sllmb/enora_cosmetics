import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BoutonDeconnexion } from "@/features/compte";
import { exigerAdmin } from "@/features/compte/serveur";
import { Logo } from "@/shared/ui";
import { NavAdmin } from "../_composants/NavAdmin";

// Accès : proxy (redirection) + exigerAdmin() dans chaque page et action + RLS.
export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Admin Énora" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="border-b border-bordure bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex h-16 items-center gap-3 px-6">
          <Link href="/admin" aria-label="Administration Énora">
            <Logo className="w-24" />
          </Link>
          <span className="titre-espace text-texte-attenue">Admin</span>
        </div>
        <NavAdmin />
        <div className="mt-auto hidden flex-col gap-2 border-t border-bordure p-4 lg:flex">
          <Suspense fallback={null}>
            <CompteAdmin />
          </Suspense>
        </div>
      </aside>
      <main id="contenu" className="min-w-0 flex-1 bg-fond">
        {children}
      </main>
    </div>
  );
}

async function CompteAdmin() {
  const { email } = await exigerAdmin();
  return (
    <>
      <p className="truncate text-xs text-texte-attenue" title={email}>
        {email}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-primaire hover:underline"
        target="_blank"
      >
        <ExternalLink aria-hidden className="size-4" /> Voir le site
      </Link>
      <BoutonDeconnexion />
    </>
  );
}
