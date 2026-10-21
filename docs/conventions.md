# Conventions

## Nommage

| Élément               | Convention                                   | Exemple                                  |
| --------------------- | -------------------------------------------- | ---------------------------------------- |
| Composant             | PascalCase, un composant exporté par fichier | `CarteProduit.tsx`                       |
| Page (fichier Next)   | `page.tsx`, fonction `<Nom>Page`             | `PanierPage`                             |
| Hook                  | `use…`                                       | `usePanier`                              |
| Server Action         | verbe à l'infinitif                          | `creerCommande`, `changerStatutCommande` |
| Lecture serveur       | `lire…` / `lister…`                          | `lireProduitParSlug`, `listerProduits`   |
| Schéma Zod            | camelCase + `Schema`                         | `commandeSchema`                         |
| Type                  | PascalCase, sans préfixe `I`                 | `Produit`, `LigneCommande`               |
| Constante             | SCREAMING_SNAKE_CASE                         | `QUANTITE_MAX`                           |
| Dossier               | kebab-case                                   | `features/commande`                      |
| Tables / colonnes SQL | snake_case, tables au pluriel                | `commande_lignes.prix_unitaire`          |
| Migration             | `AAAAMMJJHHMMSS_description.sql`             | `20261021000000_schema_initial.sql`      |

- Vocabulaire **métier en français** (produit, commande, panier) ; conventions React / Next en anglais
  (`use…`, `page.tsx`, `layout.tsx`).
- Exports nommés, sauf les fichiers spéciaux de Next.js (`page`, `layout`, `error`…) qui exigent un
  export par défaut.
- Composant > ~200 lignes → découpé.

## Imports

Ordre : externes → `@/app` → `@/features` → `@/shared` → relatifs. Prettier formate, ESLint
vérifie les frontières (voir `docs/architecture.md`).

## Styles

- Uniquement les jetons sémantiques : `bg-fond`, `bg-surface`, `text-texte`, `text-texte-attenue`,
  `border-bordure`, `bg-primaire`, `text-danger`… Jamais de couleur hexadécimale dans un composant.
- Durées : `duration-150` (survol), `duration-220` (transitions), animation `animate-apparition`.
  On n'anime que `transform` et `opacity`. `prefers-reduced-motion` respecté globalement.
- Mobile d'abord ; `100dvh`, jamais `100vh` ; aucun défilement horizontal à 320 px.

## Commentaires

Seulement pour une règle métier (`// RM-08 : …`), une décision ou une contrainte non évidente.

## Git

- Branches : `main` (stable, en ligne), `develop` (intégration), `feat/<module>-<sujet>`,
  `fix/<sujet>`, `chore/<sujet>`.
- Conventional Commits en français : `feat(panier): ajouter le compteur dans l'en-tête`.
  Types : feat, fix, refactor, style, test, docs, chore, build, ci, perf.
- Citer les règles (RM-08) et tâches (S2-03) concernées.
- Un commit par changement cohérent ; rien n'est poussé sans accord.
- Avant de fusionner : `npm run lint && npm run typecheck && npm test && npm run build`.
