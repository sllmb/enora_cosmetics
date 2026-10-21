import type { NextConfig } from "next";

// Photos des produits : seul le bucket public du projet Supabase est autorisé.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    remotePatterns: supabaseUrl ? [new URL(`${supabaseUrl}/storage/v1/object/public/**`)] : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
