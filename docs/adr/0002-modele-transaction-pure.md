# 2. Modèle de données centré uniquement sur les Transactions d'Actifs (Sans poche Cash)

- **Statut** : Accepté
- **Date** : 2026-08-09

## Contexte et Problématique

L'utilisateur souhaite un tracker focalisé sur l'évolution long terme de ses investissements (ETF/Actions sur PEA et CTO) sans encombrer la saisie avec la gestion des soldes d'espèces ou virements bancaires intermédiaires.

## Décision

Ne pas inclure de compte cash ni de solde de liquidités. Les mouvements financiers sont uniquement basés sur les transactions d'actifs (`ACHAT`, `VENTE`, `DIVIDENDE`).

## Conséquences

### Positives
- Expérience utilisateur extrêmement fluide et saisie rapide des achats mensuels (DCA).
- Pas de gestion de décalage entre virement cash et exécution d'ordre.

### Négatives / Risques
- Impossible de suivre les espèces non investies en attente sur le compte PEA/CTO.
