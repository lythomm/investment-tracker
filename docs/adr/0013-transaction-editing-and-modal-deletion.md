# 13. Modification et Suppression des Transactions via Modale Réactive

- **Statut** : Accepté
- **Date** : 2026-08-12

## Contexte et Problématique

Jusqu me maintenant, les transactions enregistrées dans le journal ne pouvaient être que supprimées rapidement via une icône dans le tableau. Il n'existait pas de moyen de consulter ou de corriger les informations d'une transaction existante (changement de quantité, de prix unitaire, de compte d'investissement, de type d'opération, de date ou de frais) sans devoir supprimer et recréer la transaction.

## Décision

1. **Modale d'Édition Dédiée (`EditTransactionModal`)** :
   - Un clic sur n'importe quelle ligne des tableaux de transactions (`TransactionsList` et `RecentInvestmentsTable`) ouvre une modale de consultation et modification complète.
   - Tous les champs de la transaction sont éditables : Type (`ACHAT`, `VENTE`, `DIVIDENDE`), Compte d'investissement, Actif rattaché, Quantité, Prix unitaire, Frais et Date.

2. **Suppression Intégrée avec Confirmation** :
   - Depuis cette même modale, l'utilisateur a accès à un bouton "Supprimer la transaction" sécurisé par une étape de confirmation (`ConfirmModal`).
   - La suppression rapide depuis l'icône corbeille de la ligne de tableau reste également accessible tout en empêchant la propagation de l'événement au clic de la ligne (`e.stopPropagation()`).

3. **Mise à Jour Réactive de l'État Backend** :
   - Ajout d'une mutation Convex `updateTransaction` dans `convex/transactions.ts` avec vérification stricte de l'authentification (`getAuthUserId`) et de la propriété des objets (`userId`).
   - Toutes les métriques de portefeuille (PRU, Plus-Value Latente, Allocation, Snapshots) sont immédiatement et automatiquement recalculées de manière réactive par Convex.

## Conséquences

- Flexibilité d'utilisation accrue sans perte de données.
- Auditabilité et gestion des erreurs de saisie simplifiées pour l'utilisateur.
