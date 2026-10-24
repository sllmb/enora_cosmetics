import Link from "next/link";
import { Logo } from "@/shared/ui";
import { menuPied, type CategorieMenu } from "../_navigation/menus";

export function PiedDePage({ categories }: { categories: CategorieMenu[] }) {
  return (
    <footer className="mt-24 bg-primaire text-sur-primaire">
      <div className="conteneur grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-4">
          <Logo forme="complet" clair className="w-44" />
          <p className="max-w-xs text-sm text-sur-primaire/80">
            L&apos;hygiène corporelle raffinée : déodorants, huiles parfumées et savons, livrés à
            Dakar et environs.
          </p>
        </div>
        {menuPied(categories).map((colonne) => (
          <nav key={colonne.titre} aria-label={colonne.titre}>
            <h2 className="font-sans titre-espace text-sur-primaire/70">{colonne.titre}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {colonne.liens.map((lien) => (
                <li key={lien.href}>
                  <Link href={lien.href} className="hover:underline">
                    {lien.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-sur-primaire/15">
        <p className="conteneur py-6 text-xs text-sur-primaire/70">
          © Énora Cosmetics — Dakar, Sénégal
        </p>
      </div>
    </footer>
  );
}
