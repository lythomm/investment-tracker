# 11. Diagramme de Répartition du Portefeuille (Donut Chart)

- **Statut** : Accepté
- **Date** : 2026-08-09

## Contexte et Problématique

La page [positions/page.tsx](file:///c:/Users/Thomas/workspace/myProjects/investment-tracker/src/app/positions/page.tsx) affichait uniquement le tableau plat des positions sans visualisation synthétique de la répartition du capital par actif.

## Décisions prises

1. **Utilisation de Recharts** : Réutilisation de Recharts (`PieChart`, `Pie`, `Cell`, `Tooltip`, `ResponsiveContainer`) déjà présent dans la stack du projet.
2. **Nouveau composant `PortfolioAllocationCard`** :
   - Format Donut Chart (anneau avec la valeur totale du portefeuille affichée au centre).
   - Découpage par actif individuel basé sur la valorisation actuelle (`currentValuation`).
   - Calcul et affichage dynamique des pourcentages de pondération.
3. **Disposition Responsive** :
   - Grille 2/3 + 1/3 sur écran large (`grid-cols-1 lg:grid-cols-3`).
   - Carte de répartition à gauche (`lg:col-span-1`), table des positions à droite (`lg:col-span-2`).
   - Empilement vertical sur mobile.
