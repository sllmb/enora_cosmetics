import type { MetadataRoute } from "next";
import { env } from "@/shared/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/compte", "/commande", "/panier"] },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
