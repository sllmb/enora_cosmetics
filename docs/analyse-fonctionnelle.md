# Analyse fonctionnelle — Énora Cosmetics

## Objet

Boutique en ligne de produits d'**hygiène corporelle** (pas de skincare) :

- **V1** : déodorants, huiles parfumées (petits flacons de parfum), savons.
- **Plus tard** : gels douche, brosses et accessoires de bain, autres produits d'hygiène corporelle.
  Les catégories sont en base : en ajouter une ne demande aucun code.

Marché : Sénégal (Dakar et régions), site en français, prix en FCFA (entiers).

## Rôles

| Rôle            | Accès                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------ |
| Visiteur        | Catalogue, fiches produit, conseils, avis publiés, panier, commande en invité              |
| Client connecté | + profil, adresse par défaut, historique de commandes, dépôt d'avis                        |
| Administrateur  | + back-office `/admin` : produits, stock, catégories, commandes, livraison, avis, articles |

## Pages

| Espace         | Adresse                                                                                  | Sprint |
| -------------- | ---------------------------------------------------------------------------------------- | ------ |
| Public         | `/` accueil, `/boutique`, `/boutique/[categorie]`, `/produit/[slug]`                     | 1      |
| Public         | `/panier`, `/commande`, `/commande/confirmation/[reference]`, `/livraison`               | 2      |
| Compte         | `/compte`, `/compte/connexion`, `/compte/inscription`, `/compte/commandes`               | 3      |
| Admin          | `/admin`, `/admin/commandes`, `/admin/produits`, `/admin/categories`, `/admin/livraison` | 4      |
| Public / Admin | `/conseils`, `/conseils/[slug]`, `/admin/avis`, `/admin/articles`                        | 5      |
| Public         | `/a-propos`, `/contact`, `/cgv`, `/mentions-legales`                                     | 6      |

## Parcours critiques (tests e2e)

- **P1** Achat invité, paiement à la livraison : accueil → catégorie → fiche → panier → commande → confirmation.
- **P2** Achat avec commande WhatsApp : la commande est enregistrée **avant** l'ouverture de WhatsApp.
- **P3** Client : inscription → commande → retrouver la commande dans « Mes commandes ».
- **P4** Admin : passer une commande de « en attente » à « livrée » ; modifier stock et prix.

## Règles métier

Toutes sont contrôlées **côté serveur** (Server Action et/ou RLS / contraintes SQL) ; l'interface ne fait que les refléter.

| Id    | Règle                                                                                                                                                                                              |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RM-01 | Seuls les comptes présents dans `admins` accèdent à `/admin` et aux écritures du catalogue (`est_admin()`).                                                                                        |
| RM-02 | Un produit inactif ou d'une catégorie inactive n'est pas visible du public.                                                                                                                        |
| RM-03 | Un prix promo est strictement inférieur au prix normal ; sinon il est ignoré.                                                                                                                      |
| RM-04 | Le stock ne peut pas être négatif ; un produit à stock 0 reste visible mais « Épuisé », non commandable.                                                                                           |
| RM-05 | Quantité par ligne : 1 à 20 ; quantité demandée ≤ stock disponible.                                                                                                                                |
| RM-06 | Les lignes de commande copient nom et prix au moment de l'achat (l'historique ne change pas).                                                                                                      |
| RM-07 | Chaque commande reçoit une référence lisible unique `ENR-AAAA-NNNNN`.                                                                                                                              |
| RM-08 | Le navigateur n'insère jamais une commande : le serveur relit prix, promos, stock et frais de livraison, recalcule le total et décrémente le stock dans une même transaction.                      |
| RM-09 | Statuts : `en_attente → confirmee → expediee → livree` ; `annulee` possible avant `livree` (le stock est alors restitué).                                                                          |
| RM-10 | Un avis ne peut être déposé que par un client dont une commande livrée contient le produit ; un seul avis par produit.                                                                             |
| RM-11 | Un avis est publié uniquement après modération.                                                                                                                                                    |
| RM-12 | Paiement Wave / Orange Money (V1) : la commande reste `en_attente` jusqu'à confirmation manuelle du paiement par l'admin.                                                                          |
| RM-13 | Téléphone obligatoire et sénégalais (70/75/76/77/78/33) ; email facultatif.                                                                                                                        |
| RM-14 | Un commentaire d'article est déposé par une cliente connectée et publié uniquement après modération ; 5 commentaires en attente au plus par personne.                                              |
| RM-15 | Au plus 3 commandes en attente par numéro de téléphone sur 24 h et 5 commandes par connexion (empreinte non réversible de l'IP) par heure ; au-delà, la cliente est invitée à écrire sur WhatsApp. |

## Paiement

| Mode                | V1                                                                                           | V2                                        |
| ------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------- |
| À la livraison      | Espèces ou mobile money au livreur                                                           | —                                         |
| Wave / Orange Money | Instructions (numéro marchand + référence) sur la confirmation ; validation manuelle (RM-12) | Agrégateur (PayDunya / PayTech) + webhook |
| WhatsApp            | Commande enregistrée, puis `wa.me` avec message pré-rempli (référence, articles, total)      | —                                         |

## États à gérer

Catalogue vide, catégorie vide, produit épuisé, promo, panier vide, produit retiré du panier car épuisé entre-temps,
erreur réseau, session expirée, commande introuvable, aucune commande, avis en attente.

## Points à trancher

- Numéros WhatsApp et marchands Wave / Orange Money définitifs.
- Zones et frais de livraison réels (valeurs de démonstration dans `supabase/seed.sql`).
- Livraison offerte à partir d'un montant ? (V2)
- Nom de domaine et hébergement (Vercel proposé).
- Version vectorielle (SVG) du logo, si le graphiste peut la fournir.
