# Règles de travail

Adaptées du modèle SavoirLAB. Elles s'appliquent à toute contribution.

**R1 — Comprendre avant d'agir.** Lire le code concerné, la documentation et le plan avant de modifier.

**R2 — L'analyse fonctionnelle fait référence.** `docs/analyse-fonctionnelle.md` décrit rôles,
pages et règles RM-xx. Tout écart demande un accord et une mise à jour du document.

**R3 — Accord requis pour toute décision majeure** (stack, architecture, règle métier, paiement,
suppression de données). Chaque décision est inscrite, datée, dans le README.

**R4 — Git.** Un commit par changement cohérent (Conventional Commits en français). Branche dédiée
pour tout travail risqué ou expérimental. Branches : `main` (stable), `develop` (travail courant),
`feat/<module>-<sujet>` depuis `develop`. Les commits ne portent que l'auteur du dépôt : aucune
ligne `Co-Authored-By` ni mention d'outil. Seul le responsable du dépôt pousse et fusionne sur
GitHub ; les contributeurs lui fournissent les commandes.

**R5 — Une fonctionnalité est terminée** quand : la règle est comprise, le code serveur et
l'interface sont faits, les cas normaux, vides et d'erreur sont gérés, les droits et le responsive
(320 → 1280 px) sont vérifiés, les tests passent, la documentation est à jour.

**R6 — Qualité.** Pas de duplication ni de code mort, pas de `catch` vide sans justification,
commentaires seulement pour une règle métier / décision / contrainte, textes visibles en français.

**R7 — Tests.** Ne jamais supprimer ni affaiblir un test pour le faire passer. Dire honnêtement ce
qui n'a pas été vérifié.

**R8 — Documentation vivante,** dans le même commit que le code : README (état, décisions),
CONTRIBUTING (journal daté), plan (⬜ → 🟦 → ✅), docs concernés.

**R9 — Résumé de fin d'étape :** terminé, modifié, testé, problèmes, prochaine étape.

**R10 — Sécurité.** Aucun secret dans Git ; aucune vraie donnée personnelle en démo ; règles
métier et droits vérifiés côté serveur (Server Action + RLS), jamais seulement dans l'interface.

**R11 — Architecture.** Respecter `docs/architecture.md` : `features/` par domaine importés via
leur `index.ts`, `shared/` sans logique métier, jetons de design uniquement.
