# 12. Intégration de Motion pour les animations UI fluides et vivantes

- **Statut** : Accepté
- **Date** : 2026-08-10

## Contexte et Problématique

L'interface de l'application Investment Tracker manque de dynamisme et de retours visuels interactifs lors de la navigation, de l'affichage des métriques, de la sélection des puces de compte et de la gestion des modales. L'objectif est d'ajouter des animations fluides, modernes et vivantes sans dégrader les performances ni compromettre l'accessibilité.

## Décision

1. **Bibliothèque** : Utiliser la bibliothèque `motion` (`framer-motion` v12) supportant React 19 et Next.js App Router.
2. **Design System & Motion** : Adopter des physiques de ressort ("Spring physics" : `type: "spring", stiffness: 300, damping: 30`) pour des mouvements naturels style Apple/iOS.
3. **Portée** :
   - Apparition et stagger des cartes de métriques et graphiques (`MetricsOverview`, `HoldingsTable`, `FinancialPerformanceCard`).
   - Transitions d'ouverture / fermeture dynamiques avec backdrop flou pour les modales (`Modal.tsx`, `AddAccountModal`, etc.).
   - Micro-interactions sur les boutons (`Button.tsx`), puces de filtres (`AccountFilterPills.tsx`), et toggles.
4. **Accessibilité** : Prise en charge native de `prefers-reduced-motion` pour basculer automatiquement sur des transitions instantanées ou de simples fondus transparents.

## Conséquences

### Positives
- Rendu visuel haut de gamme ("WOW factor") et dynamique.
- Transitions de modales et de listes fluides sans clignotement.
- Respect strict de l'accessibilité pour les utilisateurs sensibles au mouvement.

### Négatives / Risques
- Ajout de la dépendance npm `motion`.
- Nécessite la directive `"use client"` sur les composants wrapper animés.
