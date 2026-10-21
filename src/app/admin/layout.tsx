import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/shared/ui";
import { NavAdmin } from "../_composants/NavAdmin";

// La garde serveur (proxy + est_admin()) arrive au Sprint 4 ; d'ici là ces
// pages ne contiennent aucune donnée.
export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Admin Énora" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="border-b border-bordure bg-surface lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex h-16 items-center gap-3 px-6">
          <Link href="/admin" aria-label="Administration Énora">
            <Logo className="w-24" />
          </Link>
          <span className="titre-espace text-texte-attenue">Admin</span>
        </div>
        <NavAdmin />
      </aside>
      <main id="contenu" className="flex-1">
        {children}
      </main>
    </div>
  );
}
