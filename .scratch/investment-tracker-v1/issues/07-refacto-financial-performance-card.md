# Refonte de la Performance Financière du Dashboard

## Problem Statement

Le composant de performance financière affichait une courbe statique basée sur des données ficitives en cas d'absence d'historique, un sélecteur de période temporel inactif, une vue limitée à une seule courbe de valorisation sans comparaison avec le capital investi, des filtres de compte ignorés, et des indicateurs statiques/trompeurs.

## Solution

Remplacer la carte par un composant totalement dynamique et interactif :
- Double courbe comparant le Capital Investi (apports nets) et la Valorisation Totale du portefeuille.
- Sélecteur de période temporel fonctionnel (`1A`, `3A`, `Tout`).
- Prise en compte dynamique du filtre de compte sélectionné (PEA, CTO ou Tous les comptes).
- Reconstitution dynamique des points historiques à partir des transactions enregistrées si aucun snapshot mensuel n'est disponible.
- Section "Aperçu Rapide" alimentée par de vrais indicateurs calculés réels (plus-value latente globale, apports cumulés, premier actif en valeur, dividendes perçus).

## User Stories

1. En tant qu'investisseur, je veux comparer graphiquement le capital investi et la valeur actuelle de mon portefeuille au fil du temps, afin de visualiser rapidement mes gains/pertes cumulés.
2. En tant qu'investisseur, je veux filtrer l'historique de performance par période (`1A`, `3A`, `Tout`), afin d'analyser l'évolution récente ou globale de mon patrimoine.
3. En tant qu'investisseur, je veux que la carte de performance s'adapte lorsque je filtre sur un compte spécifique (PEA ou CTO), afin de mesurer la performance par enveloppe fiscale.
4. En tant qu'investisseur, je veux voir des indicateurs réels et exacts dans la section "Aperçu Rapide" (plus-value, apports, top asset, dividendes), afin d'avoir une synthèse fiable de mes investissements.
5. En tant que nouvel utilisateur sans historique snapshot, je veux voir une courbe générée à partir de mes transactions ou un écran vide clair (Empty State) m'incitant à ajouter mes opérations, plutôt que de fausses données déconnectées de la réalité.

## Implementation Decisions

- **Modifications backend Convex** : Mise à jour de la query des snapshots mensuels pour accepter l'argument optionnel `accountId` et restituer les points de courbe agrégés (ou calculés à partir du livre de transactions).
- **Modifications composant UI** :
  - Intégration d'un graphique Recharts à double zone (`AreaChart`) avec tooltips enrichis.
  - Activation de l'état local du filtre temporel (`1A`, `3A`, `Tout`) découpant la série temporelle.
  - Calcul et affichage dynamique des 4 indicateurs dans "Aperçu Rapide".
- **Respect de l'ADR 0009** : Conformité stricte avec les décisions consignées dans `docs/adr/0009-refacto-financial-performance-card.md`.

## Testing Decisions

- **Point d'entrée de test (Seam)** : Requête Convex `getMonthlySnapshots` et rendu réactif du composant `FinancialPerformanceCard`.
- **Comportements à tester** :
  - Rendu avec portefeuille vide (Empty State).
  - Rendu avec transactions réelles sans snapshot préalable.
  - Cohérence du filtrage temporel (`1A` vs `Tout`) et par compte (`accountId`).

## Out of Scope

- La prévision future / projection logarithmique ou monte-carlo des performances.
- L'export PDF / CSV du graphique de performance.

## Further Notes

Référencé dans ADR 0009 (`docs/adr/0009-refacto-financial-performance-card.md`).
