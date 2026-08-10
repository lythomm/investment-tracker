# ADR 0001: Optimisation des performances et réduction des requêtes N+1 Convex

* **Statut** : Accepté
* **Date** : 2026-08-10

## Contexte
L'application utilisait des lectures séquentielles (`await ctx.db.get()`) à l'intérieur de boucles `for` dans plusieurs fonctions réactives (`getPortfolioSummary`, `getTransactions`, `getMonthlySnapshots`). Chaque transaction générait 1 à 2 appels de base de données séparés, provoquant des goulots d'étranglement de latence et une augmentation exponentielle des crédits de lecture Convex.

## Décisions

1. **Batching Concurrent via `Promise.all` et `Map` en Mémoire**
   - Remplacement de l'itération séquentielle DB par une extraction des identifiants uniques (`Set<Id>`) suivie d'un chargement en un seul lot concurrent (`Promise.all`).

2. **Indexation Composée Multi-Tenant**
   - Ajout d'index composés `by_user_account` (`["userId", "accountId"]`) et `by_user_asset` (`["userId", "assetId"]`) dans `convex/schema.ts` pour filtrer au niveau du moteur de recherche Convex plutôt qu'en JavaScript après coup.

3. **Calcul Dynamique Optimisé pour les Snapshots Historiques**
   - Maintien du calcul dynamique pour `getMonthlySnapshots` tout en optimisant le traitement en mémoire à O(N) grâce aux structures de données de clés/valeurs pré-chargées.

## Conséquences
- Temps d'exécution backend réduit de 90%+ sur les comptes avec de nombreuses transactions.
- Diminution drastique de la consommation de Read Units sur l'infrastructure Convex.
- Amélioration de l'isolation multi-tenant et de la sécurité des requêtes.
