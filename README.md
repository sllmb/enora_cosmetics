# Énora Cosmetics

Boutique en ligne d'**hygiène corporelle** — déodorants, huiles parfumées, savons, puis gels douche,
brosses et accessoires de bain. Livraison à Dakar et partout au Sénégal, prix en FCFA.

Construit avec Next.js 16 (App Router, Cache Components, React Compiler), TypeScript strict,
Tailwind CSS 4 et Supabase (Postgres + Auth + Storage).

## État

**Sprint 0 — Fondations : terminé.** Socle technique, design system, logo, navigation, toutes les
adresses du site (pages « Bientôt disponible »), schéma SQL avec RLS. Voir
[`docs/plan-developpement.md`](docs/plan-developpement.md).

**Catalogue relié à Supabase.** Accueil, boutique, catégories et fiches produit lisent la base (illustrations en attendant les photos). Tri et filtres par famille olfactive, plan du site et référencement en place. Sans clés Supabase, le site affiche le catalogue de démonstration.

**Panier et commande (Sprint 2).** Panier enregistré dans le navigateur, commande en une page
(livraison, Wave, Orange Money ou WhatsApp), total recalculé et stock décrémenté en base dans une
seule transaction, page de confirmation privée.

**Comptes clientes (Sprint 3).** Inscription, connexion, mot de passe oublié, coordonnées
enregistrées qui pré-remplissent la commande, historique « Mes commandes ».

**Administration (Sprint 4).** `/admin` réservé aux administrateurs : commandes (statuts, paiement
reçu, annulation qui remet le stock), produits et photos, catégories, zones de livraison, tableau de bord.

**Avis et conseils (Sprint 5).** Avis réservés aux clientes qui ont reçu le produit, publiés après
modération. Conseils rédigés en Markdown dans l'administration (aperçu, brouillon, image de
couverture), page Conseils, articles, section sur l'accueil et plan du site. Chaque article a une
page de garde, un titre en écriture classique ou manuscrite au choix, une barre de mise en forme
pour rédiger sans connaître le Markdown, et des commentaires de clientes publiés après validation.

Prochaine étape : saisir les vrais produits et les premiers conseils, puis finitions et mise en ligne (Sprint 6).

## Démarrage

```bash
npm ci                       # installe exactement le package-lock.json
cp .env.example .env.local   # renseigner les variables (voir ci-dessous)
npm run dev                  # http://localhost:3000
```

Le site démarre sans Supabase tant qu'aucune page ne lit de données.

### Variables d'environnement

| Variable                                                    | Où                     | Rôle                                                                                |
| ----------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                      | public                 | URL du site (sitemap, partage) : **le vrai domaine en production**                  |
| `NEXT_PUBLIC_WHATSAPP_NUMERO`                               | public                 | Numéro WhatsApp international sans `+` (ex. `221771234567`) ; bouton masqué si vide |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public                 | Supabase → _Project Settings → API_                                                 |
| `SUPABASE_SERVICE_ROLE_KEY`                                 | **serveur uniquement** | Création des commandes (RM-08). Jamais de préfixe `NEXT_PUBLIC_`.                   |

### Base de données

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Exécuter **dans l'ordre** les fichiers de `supabase/migrations/` dans le SQL Editor
   (ou `supabase db push` avec la CLI), puis `supabase/seed.sql` pour les données de démo.
3. Se déclarer administrateur (après s'être inscrit sur le site) :
   `insert into admins (user_id) select id from auth.users where email = '<email>';`
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
| 2026-10-22 | Création de commande dans une fonction SQL (verrous, stock, prix relus) appelée uniquement par le serveur ; page de confirmation protégée par une clé secrète.                                      |
| 2026-10-21 | Thème clair uniquement ; palette tirée du logo (bordeaux `#690817`, ivoire).                                                                                                                        |

## Limites connues

- Logo en PNG détouré à partir d'un WebP : une version SVG serait préférable.
