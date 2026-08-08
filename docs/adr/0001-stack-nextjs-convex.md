# 1. Stack technique : Next.js et Convex

- **Statut** : Accepté
- **Date** : 2026-08-09

## Contexte et Problématique

L'application doit permettre le suivi d'investissements sur le long terme avec des mises à jour en temps réel des positions, un stockage réactif et un historique précis sur 5-10 ans.

## Décision

Utiliser **Next.js** pour la couche frontend/SSR et **Convex** comme backend réactif / base de données temps réel.

## Conséquences

### Positives
- Modèle de données réactif sans boilerplate REST/GraphQL.
- Invalidation et synchronisation automatiques de l'UI dès qu'une transaction est ajoutée.
- TypeScript end-to-end natif entre les schémas Convex et les composants React.

### Négatives / Risques
- Dépendance à l'écosystème Convex pour la persistance.
- Nécessite d'adapter le modèle d'agrégation d'historique long terme aux requêtes/mutations Convex.
