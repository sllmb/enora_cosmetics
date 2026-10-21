# Énora Cosmetics

Boutique en ligne d'**hygiène corporelle** — déodorants, huiles parfumées, savons, puis gels douche,
brosses et accessoires de bain. Livraison à Dakar et partout au Sénégal, prix en FCFA.

Construit avec Next.js 16 (App Router, Cache Components, React Compiler), TypeScript strict,
Tailwind CSS 4 et Supabase (Postgres + Auth + Storage).

## État

**Sprint 0 — Fondations : terminé.** Socle technique, design system, logo, navigation, toutes les
adresses du site (pages « Bientôt disponible »), schéma SQL avec RLS. Voir
[`docs/plan-developpement.md`](docs/plan-developpement.md).

Prochaine étape : créer le projet Supabase (S0-07), valider la maquette (S0-08), puis le catalogue.

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner les variables (voir ci-dessous)
npm run dev                  # http://localhost:3000
```

Le site démarre sans Supabase tant qu'aucune page ne lit de données.

### Variables d'environnement

| Variable                                                    | Où                     | Rôle                                                                                |
| ----------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                      | public                 | URL du site (métadonnées, sitemap)                                                  |
| `NEXT_PUBLIC_WHATSAPP_NUMERO`                               | public                 | Numéro WhatsApp international sans `+` (ex. `221771234567`) ; bouton masqué si vide |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public                 | Supabase → _Project Settings → API_                                                 |
| `SUPABASE_SERVICE_ROLE_KEY`                                 | **serveur uniquement** | Création des commandes (RM-08). Jamais de préfixe `NEXT_PUBLIC_`.                   |

### Base de données

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Exécuter `supabase/migrations/20261021000000_schema_initial.sql` dans le SQL Editor
   (ou `supabase db push` avec la CLI), puis `supabase/seed.sql` pour les données de démo.
3. Se déclarer administrateur : `insert into admins (user_id) values ('<uuid du compte>');`
4. Générer les types : `npm run db:types` (CLI Supabase liée au projet).

## Commandes

| Commande                             | Rôle                                               |
| ------------------------------------ | -------------------------------------------------- |
| `npm run dev`                        | Serveur de développement                           |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript                                |
| `npm test`                           | Tests unitaires (Vitest)                           |
| `npm run test:e2e`                   | Tests de bout en bout (Playwright, 375 et 1280 px) |
| `npm run format`                     | Prettier                                           |
| `npm run build`                      | Build de production                                |

## Documentation

- [`REGLES.md`](REGLES.md) — règles de travail
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — mise en route, carte des modules, journal
- [`docs/analyse-fonctionnelle.md`](docs/analyse-fonctionnelle.md) — rôles, pages, règles métier RM-xx
- [`docs/architecture.md`](docs/architecture.md) · [`docs/conventions.md`](docs/conventions.md) ·
  [`docs/design-system.md`](docs/design-system.md) · [`docs/plan-developpement.md`](docs/plan-developpement.md)

## Décisions importantes

| Date       | Décision                                                                                                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-21 | Stack Next.js + Supabase (plutôt que Spring Boot + React + Docker du modèle SavoirLAB) : une seule application, hébergement gratuit au départ, mise en ligne rapide. Principes du modèle conservés. |
| 2026-10-21 | Paiement V1 : à la livraison, Wave / Orange Money avec validation manuelle, commande WhatsApp. Paiement automatisé en V2.                                                                           |
| 2026-10-21 | Commandes créées uniquement côté serveur (service_role) après recalcul des prix (RM-08).                                                                                                            |
| 2026-10-21 | Thème clair uniquement ; palette tirée du logo (bordeaux `#690817`, ivoire).                                                                                                                        |

## Limites connues

- Supabase pas encore relié : migration SQL écrite mais **non exécutée** sur un vrai projet.
- Logo en PNG détouré à partir d'un WebP : une version SVG serait préférable.
- La garde serveur de `/admin` arrive au Sprint 4 (les pages admin ne contiennent aucune donnée d'ici là).
