import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Un module de features/ ne s'importe que par son index.ts (API publique)
      // ou par ses points d’entrée dédiés : serveur.ts (lectures serveur), admin.ts
      // (écrans d’administration).
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^@/features/[^/]+/(?!(serveur|admin)$).+",
              message:
                "Importer un module features/ via son index, son serveur.ts ou son admin.ts.",
            },
          ],
        },
      ],
    },
  },
  {
    // shared/ reste sans logique métier : il ne dépend ni de features/ ni de app/.
    files: ["src/shared/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { regex: "^@/(features|app)(/|$)", message: "shared/ n'importe ni features/ ni app/." },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
