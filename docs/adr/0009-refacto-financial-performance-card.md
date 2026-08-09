# 9. Refonte du composant Performance Financière

- **Statut** : Accepté
- **Date** : 2026-08-09

## Contexte et Problématique

Le composant `FinancialPerformanceCard` affichait une courbe statique avec des fausses données en fallback, un sélecteur de période inactif, une seule courbe sans comparaison avec le capital investi, et des indicateurs trompeurs ou statiques dans la section "Aperçu Rapide".

## Décisions prises

1. **Graphique comparatif dual (AreaChart)** : Affichage simultané du *Capital Investi* (apports net) et de la *Valorisation Totale* du portefeuille pour faire ressortir visuellement la plus-value latente.
2. **Filtrage par compte et par période** : 
   - Prise en compte du paramètre `accountId` (Tous les comptes, PEA, CTO).
   - Filtre temporel interactif (`1A`, `3A`, `Tout`).
3. **Calcul dynamique & Empty State** : Reconstitution dynamique des points à partir des transactions si aucun snapshot n'existe, et affichage d'un état vide propre sans données factices.
4. **Indicateurs réels dans Aperçu Rapide** : Remplacement des textes statiques par 4 indicateurs réels issus de `portfolioSummary` (Plus-value global %, Apports cumulés, Premier actif en valeur, Dividendes cumulés).
