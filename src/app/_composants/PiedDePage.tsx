import Link from "next/link";
import { Logo } from "@/shared/ui";
import { menuPied, type CategorieMenu } from "../_navigation/menus";

export function PiedDePage({ categories }: { categories: CategorieMenu[] }) {
  return (
    <footer className="mt-24 tissu-soie pt-3 text-sur-primaire">
      <div aria-hidden className="broderie" />
      {/* Mobile : liens sur deux colonnes sous le logo ; grands écrans : quatre colonnes. */}
      <div className="conteneur grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-12 md:py-16">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
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
