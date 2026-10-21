import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Un module de features/ ne s'importe que par son index.ts (API publique).
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^@/features/[^/]+/.+",
              message:
                "Importer un module features/ uniquement via son index (@/features/<module>).",
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
