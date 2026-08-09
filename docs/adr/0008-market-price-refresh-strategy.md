# 8. Stratégie d'actualisation automatique des cours du marché (2-min cache)

* Date : 2026-08-09
* Statut : Accepté

## Contexte
Les métriques du portefeuille (valeur totale, plus-values latentes en € et %, rendements) dépendent du prix actuel des actifs (`assets.currentPrice`). Auparavant, le cours d'un actif était figé au moment de sa création via la recherche Yahoo Finance et n'était plus jamais mis à jour, faussant la valeur en temps réel du portefeuille.

## Décisions
1. **Actualisation transparente et automatique** : La mise à jour des prix s'effectue automatiquement en arrière-plan dès l'accès au portefeuille si les cours sont plus vieux que 2 minutes.
2. **Délai de rétention / Cache (2 min)** : Un seuil de 2 minutes (`updatedAt < Date.now() - 2 * 60 * 1000`) est instauré en environnement de test pour maintenir des cours ultra récents sans surcharger inutilement Yahoo Finance.
3. **Route API & Mutation Convex** :
   - `/api/assets/refresh` interroge l'API Yahoo Finance (`v7/finance/quote` ou `v8/finance/chart`).
   - La mutation `updateAssetPrices` met à jour les cours et horodatages `updatedAt` dans Convex.
   - Le système réactif de Convex propage automatiquement les calculs actualisés (plus-value, valeur totale, rendement) dans toute l'interface sans rechargement de page.

## Conséquences
- Expérience utilisateur optimale : calculs toujours à jour à l'instant T sans action manuelle.
- Consommation réseau raisonnée vis-à-vis de l'API Yahoo.
