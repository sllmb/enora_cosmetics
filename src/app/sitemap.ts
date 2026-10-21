import type { MetadataRoute } from "next";
import { listerCategories, listerProduits } from "@/features/catalogue/serveur";
import { env } from "@/shared/config/env";

// Pages réellement publiées seulement : les pages « Bientôt disponible »
// y seront ajoutées quand elles auront un contenu.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, produits] = await Promise.all([listerCategories(), listerProduits()]);
  const url = (chemin: string) => `${env.siteUrl}${chemin}`;
  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/boutique"), changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((c) => ({
      url: url(`/boutique/${c.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...produits.map((p) => ({
      url: url(`/produit/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: p.images.map((i) => i.url),
    })),
  ];
}
