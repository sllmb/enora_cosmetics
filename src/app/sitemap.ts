import type { MetadataRoute } from "next";
import { listerCategories, listerProduits } from "@/features/catalogue/serveur";
import { listerArticles } from "@/features/conseils/serveur";
import { env } from "@/shared/config/env";

// Pages réellement publiées seulement : les pages « Bientôt disponible »
// y seront ajoutées quand elles auront un contenu.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, produits, articles] = await Promise.all([
    listerCategories(),
    listerProduits(),
    listerArticles(),
  ]);
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
    { url: url("/conseils"), changeFrequency: "weekly", priority: 0.6 },
    ...articles.map((a) => ({
      url: url(`/conseils/${a.slug}`),
      lastModified: a.misAJourLe,
      changeFrequency: "monthly" as const,
      priority: 0.5,
      ...(a.imageUrl && { images: [a.imageUrl] }),
    })),
  ];
}
