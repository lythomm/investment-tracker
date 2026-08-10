# ADR 001: Architecture Dark Mode et Design Tokens Sémantiques

## Statut
Accepté

## Contexte
L'application Folio nécessitait une mise en place du mode sombre (Dark Mode) globale, fluide, et surtout évolutive pour les futurs développements de composants. Pour éviter la duplication répétitive de classes Tailwind `dark:...` à travers chaque composant et garantir une cohérence visuelle stricte (thème clair / thème sombre / mode système), une architecture basée sur des Design Tokens sémantiques a été choisie.

## Décisions d'Architecture

### 1. Gestionnaire d'état & Persistance
- **Librairie** : `next-themes`
- **Mécanisme** : Injection automatique de la classe `.dark` sur la balise `<html>`.
- **Hydratation & FOUC** : Utilisation de `suppressHydrationWarning` sur `<html>` pour éviter tout flash blanc ou avertissement SSR lors du rendu initial.
- **Modes supportés** : Clair (`light`), Sombre (`dark`), Système (`system`).

### 2. Design Tokens CSS Sémantiques (`src/app/globals.css`)
Au lieu d'utiliser des couleurs brutes (`#edf1f2`, `bg-white`, `text-slate-900`) directement dans le JSX des composants, l'application s'appuie désormais sur des tokens CSS sémantiques s'adaptant selon que l'élément parent possède la classe `.dark` ou non :

| Token Sémantique | Classe utilitaire / Usage | Valeur Mode Clair | Valeur Mode Sombre |
| :--- | :--- | :--- | :--- |
| `--bg-app` | `.bg-app` (Fond d'écran) | `#edf1f2` | `#0b0f17` |
| `--bg-surface` | `.bg-surface` / `.card-light` | `#ffffff` | `#131926` |
| `--bg-surface-hover` | `.card-light-hover:hover` | `#f8fafc` | `#1a2334` |
| `--bg-surface-subtle` | `.bg-surface-subtle` | `#f1f5f9` | `#192233` |
| `--text-main` | `.text-main` (Titres & texte principal) | `#0f172a` | `#f8fafc` |
| `--text-muted` | `.text-muted` (Sous-titres & labels) | `#64748b` | `#94a3b8` |
| `--border-subtle` | `.border-subtle` (Bordures de cartes et séparateurs) | `#e2e8f0` | `#1e293b` |

### 3. Composants d'Interface
- **`ThemeToggle`** (`src/components/ThemeToggle.tsx`) : Bouton de basculement interactif qui fait défiler les thèmes Clair ☀️ ➔ Sombre 🌙 ➔ Système 🖥️. Placé de manière permanente dans la barre de navigation (`Navbar.tsx`).
- **Composants Reutilisables (`Button`, `Modal`, `HoldingsTable`, `FinancialPerformanceCard`)** : Modifiés pour consommer les classes utilitaires sémantiques (`bg-surface`, `text-main`, `text-muted`, `border-subtle`).

## Conséquences et Directives pour les Nouveaux Composants
Lors de la création de nouveaux composants ou de nouvelles pages :
1. **Cartes & Conteneurs** : Préférer la classe `.card-light` ou `bg-surface border border-subtle` au lieu de `bg-white`.
2. **Typographie** : Utiliser `text-main` pour le texte principal et `text-muted` pour le texte secondaire.
3. **Boutons & Actions** : Utiliser le composant `<Button variant="..." />` qui gère nativement les styles dark mode.
