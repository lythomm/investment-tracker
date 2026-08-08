# 4. Historisation et Graphiques Long Terme via Aggregation et Snapshots Mensuels

- **Statut** : Accepté
- **Date** : 2026-08-09

## Contexte et Problématique

L'utilisateur souhaite visualiser l'évolution précise de son patrimoine investi sur 5 à 10 ans mois par mois. Calculer à la volée 10 ans de transactions à chaque affichage devient coûteux au fil du temps.

## Décision

Combiner deux mécanismes :
1. Calcul déterministe à partir du livre de transactions (`ledger`) pour reconstruire l'état d'un mois spécifique si modifié rétroactivement.
2. Génération / mise en cache d'agrégats mensuels (`monthly_snapshots`) dans Convex pour restituer immédiatement les graphiques de performance long terme (5-10 ans).

## Conséquences

### Positives
- Temps de chargement instantané du graphique d'historique long terme.
- Historique exact du montant investi vs valeur de marché à chaque fin de mois.
