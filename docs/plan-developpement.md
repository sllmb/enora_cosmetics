🟦 ajout au panier au Sprint 2

Légende : ⬜ à faire · 🟦 en cours · ✅ terminé

## Sprint 0 — Fondations

| Id    | Tâche                                                                    | État                                              |
| ----- | ------------------------------------------------------------------------ | ------------------------------------------------- |
| S0-01 | Projet Next.js 16 TypeScript strict, Tailwind 4, React Compiler          | ✅                                                |
| S0-02 | Outillage : ESLint (frontières), Prettier, Vitest, Playwright, CI        | ✅                                                |
| S0-03 | Jetons de design, polices, déclinaisons du logo, icônes                  | ✅                                                |
| S0-04 | `shared/` : env, clients Supabase, format, validation, composants UI     | ✅                                                |
| S0-05 | Layout boutique et admin, toutes les routes en `PageAVenir`, 404, erreur | ✅                                                |
| S0-06 | Documentation, règles, schéma SQL initial + RLS, données de démo         | ✅                                                |
| S0-07 | Créer le projet Supabase, appliquer la migration, générer les types      | ✅ lignes validées par Zod (pas de types générés) |
| S0-08 | Maquette d'accueil et de fiche produit à valider                         | 🟦 maquette en ligne, à valider                   |

## Sprint 1 — Catalogue

| Id    | Tâche                                                                        | État                                                   |
| ----- | ---------------------------------------------------------------------------- | ------------------------------------------------------ |
| S1-01 | `features/catalogue` : lectures catégories / produits / images (`use cache`) | ✅ Supabase (cache 1 h, tag catalogue), démo sans clés |
| S1-02 | Carte produit, grille, badges (nouveauté, promo, épuisé)                     | ✅                                                     |
| S1-03 | Accueil définitif (hero, univers, nouveautés, promos)                        | ✅                                                     |
| S1-04 | Page catégorie (tri prix / nouveauté, filtre famille olfactive)              | ✅ tri, familles, disponibilité (dans l’URL)           |
| S1-05 | Fiche produit (galerie, notes olfactives, conseils, ajout au panier)         | ✅                                                     |
| S1-06 | SEO : métadonnées, `sitemap.ts`, JSON-LD Product, images OpenGraph           | ✅ sitemap, canoniques, partage, JSON-LD               |

## Sprint 2 — Panier et commande

| Id    | Tâche                                                                         | État                                                             |
| ----- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| S2-01 | `features/panier` : contexte + localStorage, compteur dans l'en-tête          | ✅                                                               |
| S2-02 | Page panier (quantités, retrait, produits devenus épuisés)                    | ✅                                                               |
| S2-03 | Tunnel : coordonnées, zone de livraison, mode de paiement, récapitulatif      | ✅ une seule page, mobile d'abord                                |
| S2-04 | Server Action `creerCommande` + fonction SQL transactionnelle (RM-05 à RM-08) | ✅ migration appliquée, commande réelle testée                   |
| S2-05 | Confirmation : instructions Wave / Orange Money, lien WhatsApp                | ✅ (numéros Wave / OM à renseigner)                              |
| S2-06 | Page « Livraison et paiement »                                                | ✅                                                               |
| S2-07 | e2e P1 et P2                                                                  | ✅ panier et formulaire en e2e ; envoi vérifié sur la vraie base |

## Sprint 3 — Comptes

| Id    | Tâche                                                                             | État                                         |
| ----- | --------------------------------------------------------------------------------- | -------------------------------------------- |
| S3-01 | Inscription / connexion (Supabase Auth email + mot de passe), mot de passe oublié | ✅ email + mot de passe, mot de passe oublié |
| S3-02 | `proxy.ts` : rafraîchissement de session                                          | ✅                                           |
| S3-03 | Profil (nom, téléphone, adresse et zone par défaut) pré-remplissant la commande   | ✅                                           |
| S3-04 | Mes commandes (liste, détail, statut)                                             | ✅                                           |
| S3-05 | e2e P3                                                                            | ✅ (avec identifiants de test, ignoré en CI) |

## Sprint 4 — Administration

| Id    | Tâche                                                                         | État                                                       |
| ----- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| S4-01 | Garde `/admin` (proxy + `est_admin()`)                                        | ✅ proxy + exigerAdmin() + RLS                             |
| S4-02 | Tableau de bord (commandes du jour, à traiter, chiffre d'affaires, stock bas) | ✅                                                         |
| S4-03 | Commandes : liste filtrée, détail, changement de statut (RM-09, RM-12)        | ✅ statuts, paiement reçu, annulation avec remise en stock |
| S4-04 | Produits : CRUD, images (Storage), stock, promo, activation                   | ✅ photos réduites dans le navigateur                      |
| S4-05 | Catégories et zones de livraison                                              | ✅                                                         |
| S4-06 | e2e P4                                                                        | ✅ accès en e2e ; écritures vérifiées sur la vraie base    |

## Sprint 5 — Avis et conseils

| Id    | Tâche                                                                                                                   | État                                                         |
| ----- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| S5-01 | Dépôt d'avis (RM-10) et affichage (note moyenne)                                                                        | ✅ réservé aux clientes livrées, JSON-LD aggregateRating     |
| S5-02 | Modération des avis (RM-11)                                                                                             | ✅ publier / refuser / supprimer, bandeau au tableau de bord |
| S5-03 | Articles : rédaction Markdown (admin), liste et lecture (public)                                                        | ✅ aperçu, brouillons, image de couverture, sitemap          |
| S5-04 | Conseils enrichis : page de garde, écriture manuscrite des titres, barre de mise en forme, commentaires modérés (RM-14) | ✅                                                           |

## Sprint 6 — Finitions et mise en ligne

| Id    | Tâche                                                             | État |
| ----- | ----------------------------------------------------------------- | ---- |
| S6-01 | Pages À propos, Contact, CGV, Mentions légales                    | ⬜   |
| S6-02 | Audit accessibilité (axe) et performances (images, LCP)           | ⬜   |
| S6-03 | Déploiement Vercel, domaine, variables d'environnement, analytics | ⬜   |

## V2 (idées)

Paiement mobile automatisé (webhook), notifications de statut (email / SMS / WhatsApp), codes
promo, livraison offerte dès X FCFA, coffrets cadeaux (Tabaski, Korité, fêtes), fidélité.
