# Architecture — Énora Cosmetics

Inspirée de l'architecture du projet SavoirLAB, dont on garde
les principes — découpage par domaine, règles métier côté serveur, jetons de design, validation
unique, tests, documentation vivante — sur une stack plus légère, adaptée à une boutique.

## Vue d'ensemble

```
Navigateur ──> Next.js 16 (Vercel)
                 ├─ Server Components : lectures (catalogue, compte) via Supabase + RLS
                 ├─ Server Actions    : écritures (commande, profil, admin) validées par Zod
                 └─ proxy.ts          : rafraîchit la session, garde /admin (Sprint 4)
                        │
                        v
               Supabase : Postgres (RLS partout) · Auth · Storage (images produits)
```

Décision (2026-10-21) : Next.js + Supabase plutôt que Spring Boot + React + Docker. Raisons : une
seule application à déployer, hébergement gratuit au départ, temps de mise en ligne court. Les
garanties de sécurité du modèle d'origine sont conservées par la RLS et les Server Actions.

## Stack

| Rôle                      | Choix                                                               |
| ------------------------- | ------------------------------------------------------------------- |
| Framework                 | Next.js 16 (App Router, Cache Components, React Compiler), React 19 |
| Langage                   | TypeScript 5.9 strict (`noUncheckedIndexedAccess`)                  |
| Données / Auth / Fichiers | Supabase (`@supabase/ssr`, `@supabase/supabase-js`)                 |
| Styles                    | Tailwind CSS 4 + jetons sémantiques (`src/styles/globals.css`)      |
| Primitives accessibles    | Radix UI (dialog, dropdown-menu)                                    |
| Formulaires               | React Hook Form + Zod 4 (mêmes schémas client et serveur)           |
| Icônes / toasts           | lucide-react / Sonner                                               |
| Tests                     | Vitest + Testing Library (unitaires), Playwright + axe-core (e2e)   |
| Qualité                   | ESLint (règles d'import), Prettier (+ tri des classes Tailwind)     |

## Arborescence

```
src/
├── app/                 ASSEMBLAGE : seul dossier qui connaît les routes
│   ├── (boutique)/      pages publiques et compte (en-tête + pied de page)
│   ├── admin/           back-office (layout dédié, noindex)
│   ├── _composants/     en-tête, pied de page, ListeLiens, PageAVenir…
│   └── _navigation/     menus.ts : SOURCE UNIQUE des menus
├── features/<module>/   UN DOSSIER PAR DOMAINE (catalogue, panier, commande, compte, avis, conseils, admin)
│   ├── actions/         Server Actions ("use server") : validation Zod -> règles -> écriture
│   ├── queries/         lectures serveur (Supabase), avec "use cache" quand c'est public
│   ├── components/      composants du domaine
│   ├── schemas/         schémas Zod (un par formulaire)
│   ├── lib/             fonctions pures du domaine (calcul du total…)
│   ├── types.ts
│   └── index.ts         API PUBLIQUE du module (seul point d'import externe)
├── shared/              SANS LOGIQUE MÉTIER
│   ├── config/env.ts    seule lecture de process.env (validée par Zod)
│   ├── lib/             cn, format (FCFA, dates), validation (téléphone SN…)
│   ├── supabase/        serveur.ts (session), navigateur.ts, service.ts (service_role, server-only)
│   └── ui/              composants génériques + index.ts
├── styles/globals.css   jetons de design
└── test/setup.ts
supabase/
├── migrations/          SQL versionné (schéma + RLS + Storage)
└── seed.sql             données de démonstration
```

### Règles de dépendance (vérifiées par ESLint)

- `shared/` n'importe ni `features/` ni `app/`.
- Un module de `features/` n'est importé que via son `index.ts` (`@/features/panier`, jamais
  `@/features/panier/lib/...`). À l'intérieur d'un module : imports relatifs.
- Découpage par **domaine**, pas par rôle : une seule `CarteProduit` pour la boutique et l'admin.

## Flux

**Lecture publique** : Server Component → `features/<m>/queries` (`"use cache"` + `cacheLife`) →
Supabase (clé anon, RLS) → composant.

**Écriture** : formulaire (RHF + Zod) → Server Action → re-validation Zod → règles métier (RM-xx) →
Supabase (client de session ; service_role seulement si la règle l'exige, ex. RM-08) →
`revalidateTag` / `refresh` → résultat typé `{ ok: true, ... } | { ok: false, code, erreurs }`.

Les composants ne lisent jamais de réponse brute : erreurs traduites en messages français à partir
d'un `code` stable.

## Sécurité

- RLS activée sur **toutes** les tables ; écritures du catalogue réservées à `est_admin()`.
- Commandes jamais insérées depuis le navigateur (RM-08).
- `SUPABASE_SERVICE_ROLE_KEY` uniquement côté serveur (`import "server-only"`), jamais `NEXT_PUBLIC_`.
- `/admin` : redirection serveur dans `proxy.ts` **et** RLS (la redirection n'est qu'un confort).
- Markdown des articles rendu sans HTML brut ; liens externes `rel="noopener noreferrer"`.
- Aucun secret dans Git (`.env*` ignorés sauf `.env.example`).

## Cache Components

`cacheComponents: true` : tout accès à une donnée d'exécution (cookies, `usePathname`, params non
pré-calculés) doit être sous `<Suspense>`. Exemple : `ListeLiens` rend une version statique des
menus, puis marque le lien actif côté client. Lectures publiques en `"use cache"` avec un tag par
ressource (`produits`, `produit:<slug>`), invalidées par les actions admin.
