# Contribuer

## Mise en route

Prérequis : Node.js ≥ 22 (24 recommandé, voir `.nvmrc`), npm, un projet Supabase (à partir du Sprint 1).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Avant chaque commit : `npm run lint && npm run typecheck && npm test`. Avant de fusionner : `npm run build`.

## Carte des modules

| Dossier                        | Contenu                                                                     |
| ------------------------------ | --------------------------------------------------------------------------- |
| `src/app/(boutique)`           | Pages publiques et compte client                                            |
| `src/app/admin`                | Back-office                                                                 |
| `src/app/_composants`          | En-tête, pied de page, `ListeLiens`, `PageAVenir`, `BoutonWhatsApp`         |
| `src/app/_navigation/menus.ts` | Source unique des menus                                                     |
| `src/features/catalogue`       | Catalogue : lectures, cartes produit, fiche produit, illustrations          |
| `src/features/panier`          | Panier enregistré dans le navigateur, compteur, page panier                 |
| `src/features/compte`          | Connexion, inscription, mot de passe, profil (Supabase Auth)                |
| `src/features/commande`        | Formulaire, Server Action `creerCommande`, confirmation, zones de livraison |
| `src/features/avis`            | Avis clientes : dépôt, étoiles, liste, modération                           |
| `src/features/conseils`        | Articles en Markdown : lecture, cartes, rédaction et image (admin)          |
| `src/shared/config/env.ts`     | Variables d'environnement validées                                          |
| `src/shared/supabase`          | Clients Supabase (session, navigateur, service_role)                        |
| `src/shared/lib`               | `cn`, format FCFA / dates, validation (téléphone SN, email, mot de passe)   |
| `src/shared/ui`                | Composants génériques                                                       |
| `supabase/`                    | Migrations SQL et données de démo                                           |

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

- **CI en échec en quelques secondes (`npm ci`, « Missing: … from lock file »)** : le
  `package-lock.json` a été produit par une version de npm qui omet certaines dépendances
  optionnelles. Le régénérer avec `npx npm@10 install --package-lock-only` puis vérifier
  `npx npm@10 ci --dry-run`.

- **Après un `git pull`** : utiliser `npm ci`, pas `npm install` (qui peut réécrire
  `package-lock.json` et casser la CI).

- **Tests e2e en local** : installer une fois le navigateur de test avec
  `npx playwright install chromium`, puis `npm run test:e2e` (`CI=1` pour reproduire la CI).

- **Page affichée mais boutons sans effet en développement** : ouvrir le site avec
  `http://localhost:3000`, pas avec l'adresse « Network » affichée par `npm run dev` (ex.
  `169.254.x.x`). Next.js y bloque le JavaScript de développement par sécurité ; pour tester
  depuis un téléphone, ajouter son adresse dans `allowedDevOrigins` (`next.config.ts`).

- **Tests du compte et de l'administration (e2e)** : comptes de test confirmés dans Supabase
  (dont un déclaré dans `admins`), puis `npm run test:e2e` avec `E2E_COMPTE_*` et `E2E_ADMIN_*`
  définis (ignorés en CI).
- **Formulaires** : toujours envoyer à la Server Action la saisie brute (`getValues()`), jamais la
  valeur déjà transformée par Zod : le serveur la revalide avec le même schéma.

## Journal

| Date       | Changement                                                                                                                                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-21 | Sprint 0 : initialisation Next.js 16, outillage, jetons de design et logo, couche `shared/`, layouts, toutes les routes, documentation, schéma SQL initial + RLS, CI.                                                               |
| 2026-10-21 | CI : Node 24, `package-lock.json` complété pour npm 10 et 11 (échec de `npm ci`).                                                                                                                                                   |
| 2026-10-21 | Maquette catalogue : module features/catalogue (données de démo, règles RM-03/04/05), illustrations produits, accueil, boutique, catégories, fiche produit (notes olfactives, JSON-LD).                                             |
| 2026-10-21 | Supabase relié (S0-07) : schéma et données installés, RLS vérifiée ; catalogue lu dans Supabase avec cache et repli sur la démo.                                                                                                    |
| 2026-10-21 | Fin du Sprint 1 : tri et filtres du catalogue (URL partageable), sitemap, URL canoniques, image de partage, JSON-LD boutique / produit / fil d’Ariane.                                                                              |
| 2026-10-22 | Sprint 4 : administration (commandes, produits et photos, catégories, zones, tableau de bord) ; formulaires qui envoient la saisie brute au serveur ; photos supprimées du stockage par le serveur.                                 |
| 2026-10-22 | Sprint 3 : comptes (Supabase Auth), proxy de session, profil qui pré-remplit la commande, Mes commandes ; formulaires en POST et boutons grisés avant chargement.                                                                   |
| 2026-10-22 | Sprint 2 : panier (navigateur), formulaire de commande, Server Action + fonction SQL `creer_commande` (RM-05 à RM-08), confirmation avec clé secrète, WhatsApp, page Livraison.                                                     |
| 2026-10-22 | Articles : images dans le texte (code court image:…, stockage articles/contenu, nettoyées à l'enregistrement et à la suppression) et cartes produit « Voir en boutique » ; article lu par son adresse (visible dès sa publication). |
| 2026-10-22 | Éditeur : barre et raccourcis (Ctrl+B/I/K/S) qui gardent l'historique Ctrl+Z ; exigerAdmin mis en cache par requête et vérifié localement (getClaims).                                                                              |
| 2026-10-22 | Brouillon d'article sauvegardé automatiquement dans le navigateur, bandeau Restaurer / Ignorer, alerte avant de quitter une saisie non enregistrée.                                                                                 |
| 2026-10-22 | Conseils enrichis : page de garde, polices manuscrites des titres (next/font, non préchargées), barre de mise en forme testée, commentaires modérés (RM-14, migration 20261024000000).                                              |
| 2026-10-22 | Sprint 5 : avis clientes (dépôt après livraison, modération, note moyenne) et conseils (Markdown sans HTML brut, aperçu, brouillons, image de couverture, sitemap, JSON-LD Article).                                                |
| 2026-10-21 | e2e réparés (titres ambigus, noindex) ; filtres à affichage immédiat (useOptimistic).                                                                                                                                               |
