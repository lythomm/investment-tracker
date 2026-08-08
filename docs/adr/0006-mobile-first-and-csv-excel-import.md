# 6. Mobile-First & Importation d'Historique Excel/CSV

- **Statut** : Accepté
- **Date** : 2026-08-09

## Contexte et Problématique

L'application remplace des feuilles de calcul Excel rudimentaires mal adaptées aux smartphones. L'expérience doit surpasser Excel avec un accès mobile instantané et une migration facile de l'historique existant.

## Décision

1. Développer l'interface en **Responsive / Mobile-First** PWA-ready (layout optimisé pour smartphone avec bottom navigation et modale rapide de saisie DCA).
2. Fournir un module d'**importation CSV/Excel** pour permettre aux utilisateurs d'importer l'historique complet de leurs achats passés en quelques secondes.

## Conséquences

### Positives
- Migration fluide depuis Excel sans ressaisie manuelle de 5 ans d'historique.
- Saisie mensuelle sur smartphone à tout moment.
