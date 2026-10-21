# Contribuer

## Mise en route

Prérequis : Node.js ≥ 20.9, npm, un projet Supabase (à partir du Sprint 1).

```bash
npm install
cp .env.example .env.local
npm run dev
```

Avant chaque commit : `npm run lint && npm run typecheck && npm test`. Avant de fusionner : `npm run build`.

## Carte des modules

| Dossier                        | Contenu                                                                   |
| ------------------------------ | ------------------------------------------------------------------------- |
| `src/app/(boutique)`           | Pages publiques et compte client                                          |
| `src/app/admin`                | Back-office                                                               |
| `src/app/_composants`          | En-tête, pied de page, `ListeLiens`, `PageAVenir`, `BoutonWhatsApp`       |
| `src/app/_navigation/menus.ts` | Source unique des menus                                                   |
| `src/features/*`               | Modules métier (à partir du Sprint 1)                                     |
| `src/shared/config/env.ts`     | Variables d'environnement validées                                        |
| `src/shared/supabase`          | Clients Supabase (session, navigateur, service_role)                      |
| `src/shared/lib`               | `cn`, format FCFA / dates, validation (téléphone SN, email, mot de passe) |
| `src/shared/ui`                | Composants génériques                                                     |
| `supabase/`                    | Migrations SQL et données de démo                                         |

## Ajouter une fonctionnalité

1. Vérifier la règle dans `docs/analyse-fonctionnelle.md` (ajouter un RM-xx si nouveau).
2. SQL : nouvelle migration (table, contraintes, RLS) → `npm run db:types`.
3. Module `features/<m>` : `queries/` → `schemas/` → `actions/` → `components/` → `index.ts` → tests.
4. Page mince dans `src/app/…` qui assemble le module (remplace la `PageAVenir`).
5. Vérifier 375 / 1280 px, états vides et erreurs ; mettre à jour plan, README, journal.

## Problèmes fréquents

- **« usePathname() outside of Suspense »** au build : Cache Components impose `<Suspense>` autour
  des données d'exécution. Utiliser `ListeLiens` pour les menus.
- **`localStorage` dans les tests** : Node 25 expose un `localStorage` global incomplet ; dans les
  tests, simuler le stockage plutôt que d'appeler `window.localStorage` directement.
- **`duration-*` personnalisés** : Tailwind 4 n'a pas d'espace de thème pour les durées ; utiliser
  `duration-150` / `duration-220`.

## Journal

| Date       | Changement                                                                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-21 | Sprint 0 : initialisation Next.js 16, outillage, jetons de design et logo, couche `shared/`, layouts, toutes les routes, documentation, schéma SQL initial + RLS, CI. |
