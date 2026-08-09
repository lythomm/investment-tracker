# 10. Calcul Dynamique de Performance et Historique de Cours (Yahoo Finance)

- **Statut** : Accepté
- **Date** : 2026-08-09

## Contexte et Problématique

L'utilisation d'une table statique `monthly_snapshots` avec le cours actuel de l'actif présentait trois limites majeures :
1. **Valorisation biaisée** : Les mois passés étaient évalués au prix du jour au lieu du cours de clôture historique réel de l'actif.
2. **Effet DCA masqué** : Les dépôts d'argent gonflaient la courbe sans distinguer le capital apporté de la plus-value boursière réelle.
3. **Rigidité des états** : Modifier une transaction passée nécessitait de réécrire manuellement des snapshots statiques.

## Décisions prises

1. **Suppression du stockage par snapshots statiques** : Abandon de la table `monthly_snapshots` comme source de vérité. L'historique de performance est calculé dynamiquement à la volée par la requête Convex.
2. **Table de stockage des cours historiques (`asset_prices_history`)** :
   - Table Convex reliant `assetId`, `yearMonth` (ex: `2026-05`) et `closingPrice` (cours de clôture du mois).
   - Alimentation automatique ou à la demande via les données d'historique de l'API Yahoo Finance (`v8/finance/chart/{ticker}?interval=1mo&range=5y`).
3. **Calcul dynamique par mois** :
   - Pour chaque mois $M$ de l'historique :
     - $\text{Capital Investi}_M = \sum \text{Achats}_{(\le M)} - \sum \text{Ventes}_{(\le M)}$
     - $\text{Valorisation}_M = \sum (\text{Quantité détenue à } M \times \text{Cours Historique}_M)$
     - $\text{Plus-Value}_M = \text{Valorisation}_M - \text{Capital Investi}_M$
4. **Visualisation Duale dans le composant `FinancialPerformanceCard`** :
   - Courbe 1 : Capital Investi (Apports cumulés de l'investisseur).
   - Courbe 2 : Valorisation Totale (Valeur marché du portefeuille).
   - Indicateur distinctif pour la plus-value réelle (€ et %).
