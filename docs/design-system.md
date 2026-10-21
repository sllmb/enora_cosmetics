# Design system — Énora

## Identité

Le logo (`public/brand/`) est un wordmark serif à contraste fort, bordeaux, avec « COSMETICS » en
capitales très espacées. Le site en reprend les codes : élégance, sobriété, beaucoup d'espace.

| Fichier                              | Usage                                                    |
| ------------------------------------ | -------------------------------------------------------- |
| `brand/wordmark-enora.png`           | En-tête (ÉNORA seul, lisible en petit)                   |
| `brand/logo-enora.png`               | Accueil, pages d'erreur (logo complet)                   |
| `brand/*-blanc.png`                  | Sur fond bordeaux (pied de page)                         |
| `brand/monogramme-e.png`             | Monogramme « É » (réseaux sociaux, emballages)           |
| `src/app/icon.png`, `apple-icon.png` | Favicon / icône d'écran d'accueil (É blanc sur bordeaux) |
| `brand/logo-enora-source.webp`       | Fichier d'origine — ne pas utiliser directement          |

Les PNG ont été détourés à partir du fichier d'origine. Une version **SVG vectorielle** serait
préférable pour l'impression et les très grandes tailles.

## Couleurs (jetons)

| Jeton                                           | Valeur                | Usage                                               | Contraste sur fond |
| ----------------------------------------------- | --------------------- | --------------------------------------------------- | ------------------ |
| `fond`                                          | `#faf6f1` ivoire      | Fond de page                                        | —                  |
| `surface`                                       | `#ffffff`             | Cartes, champs                                      | —                  |
| `surface-douce`                                 | `#f4ebe5`             | Sections alternées, survol                          | —                  |
| `surface-poudre`                                | `#ecdcd6`             | Accents doux                                        | —                  |
| `texte`                                         | `#2a1a1c`             | Texte principal                                     | 15,5:1             |
| `texte-attenue`                                 | `#6b585b`             | Texte secondaire                                    | 6,2:1              |
| `primaire`                                      | `#690817`             | Bordeaux du logo : boutons, liens, prix promo       | 11,8:1             |
| `primaire-survol`                               | `#4f0611`             | Survol des boutons                                  | —                  |
| `primaire-doux`                                 | `#f6e7e8`             | Fonds de pastilles, sélection                       | —                  |
| `bordure` / `bordure-forte`                     | `#e6d9d2` / `#94807a` | Séparateurs / contours de champs (3,5:1)            | —                  |
| `accent`                                        | `#b08d57` or          | Décoratif uniquement (2,9:1 : jamais pour du texte) | —                  |
| `succes`, `danger`, `avertissement` (+ `-doux`) |                       | États                                               | ≥ 5,5:1            |

## Typographie

- **Titres** : Cormorant Garamond (`font-titre`), graisse 500, proche du logo.
- **Texte** : Jost (`font-sans`), géométrique et lisible.
- **Sur-titres** : utilitaire `titre-espace` (capitales, `tracking-[0.3em]`), écho à « COSMETICS ».

## Formes

- Boutons en pilule (`rounded-full`), contrôles `rounded-controle` (12 px), cartes `rounded-carte` (20 px).
- Ombres teintées bordeaux très légères (`shadow-carte`, `shadow-flottant`).

## Composants (`src/shared/ui`)

`Button` / `ButtonLink` (primaire, secondaire, discret ; sm, md, lg), `IconButton` (libellé
obligatoire), `Input`, `FormField` (libellé + aide + erreur reliés), `Badge`, `Prix` (promo
accessible), `EmptyState`, `Logo`.

## Responsive et accessibilité

- Mobile d'abord : 360 px puis sm 640 / md 768 / lg 1024 / xl 1280. Menu en tiroir sous 1024 px.
- Cibles tactiles 44 px. Bouton WhatsApp flottant respectant la safe-area.
- WCAG 2.2 AA : lien « Aller au contenu », focus visible bordeaux, `aria-current` sur les menus,
  icônes décoratives `aria-hidden` toujours accompagnées d'un texte, toasts en haut au centre.
