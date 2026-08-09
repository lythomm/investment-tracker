# 7. Formulaire Multistep de Transaction et Autocomplétion Ticker Yahoo Finance

- **Statut** : Accepté
- **Date** : 2026-08-09

## Contexte et Problématique

L'ajout de transaction se faisait précédemment via un composant modal surchargé (`AddTransactionModal.tsx`). La saisie du Ticker et du nom d'actif était manuelle, avec risque d'erreurs de frappe et une expérience utilisateur médiocre sur mobile.

## Décision

1. Remplacer la modal par une **page dédiée** `/transactions/new` avec un formulaire guidé en **4 étapes** :
   - Étape 1 : Type d'opération (`ACHAT`, `VENTE`, `DIVIDENDE`)
   - Étape 2 : Sélection du compte d'investissement (`PEA`, `CTO`)
   - Étape 3 : Saisie du Ticker avec autocomplétion Yahoo Finance & choix du type d'actif (`ETF`, `Action`)
   - Étape 4 : Détails financiers (`Quantité`, `Prix unitaire`, `Frais`) et Date de l'opération
2. Créer un proxy API Next.js `/api/assets/search` sollicitant Yahoo Finance avec debounce (300ms) pour autocompléter le ticker et le nom complet de l'actif, ainsi qu'extraire le cours de marché actuel (`currentPrice`).
3. Chercher en priorité dans la base local Convex `assets` avant d'interroger l'API distante.

## Conséquences

### Positives
- Expérience utilisateur guidée et intuitive, sans surcharge d'information.
- Élimination des erreurs de saisie manuelle de Ticker grâce à la recherche dynamique.
- Récupération automatique du nom complet de l'entreprise/ETF et du cours de marché initial.
- Codebase plus propre par la suppression de l'ancienne modal.

### Négatives / Risques
- Dépendance à la disponibilité de l'endpoint de recherche Yahoo Finance.
