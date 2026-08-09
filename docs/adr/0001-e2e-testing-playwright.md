# ADR 0001 : Adoption de Playwright pour les tests End-to-End (E2E)

- **Statut** : Accepté
- **Date** : 2026-08-09
- **Auteurs** : Équipe Développement

## Contexte
L'application de suivi d'investissement (Portfolio Dashboard, Transactions, Positions, Comptes) nécessite une couverture de tests automatisés de bout en bout (E2E) afin de garantir la non-régression de l'interface utilisateur et de l'intégration avec le backend Convex.

## Décision
Nous adoptons **Playwright** (`@playwright/test`) comme framework de tests E2E principal pour l'application Next.js.

### Raisons du choix :
1. **Performance et rapidité** : Exécution rapide et en parallèle des tests.
2. **Intégration Next.js native** : Prise en charge fluide du serveur d'arrière-plan `npm run dev`.
3. **Fiabilité des sélecteurs** : Auto-waiting natif réduisant les faux positifs (flaky tests).
4. **Outillage de diagnostic** : Capture automatique de screenshots et traces lors des échecs de test.

## Conséquences
- Les tests E2E sont stockés dans le dossier `tests/e2e/`.
- Les commandes d'exécution sont `npm run test:e2e` et `npm run test:e2e:ui`.
- Chaque nouvelle fonctionnalité doit comporter une suite de tests E2E Playwright associée.
