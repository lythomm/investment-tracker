# 3. Authentification avec Convex Auth

- **Statut** : Accepté
- **Date** : 2026-08-09

## Contexte et Problématique

Chaque utilisateur doit pouvoir enregistrer ses données d'investissement de manière sécurisée et isolée.

## Décision

Utiliser `@convex-dev/auth` (Convex Auth) pour la gestion de l'authentification (Magic Link / OAuth / Mot de passe).

## Conséquences

### Positives
- Authentification directement intégrée au backend Convex sans dépendance tierce externe payante.
- Validation des autorisations ultra-rapide côté serveur dans les queries et mutations Convex.
