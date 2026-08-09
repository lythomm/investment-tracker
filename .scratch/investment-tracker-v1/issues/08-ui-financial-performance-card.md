# 08 — Graphique Dual AreaChart & KPIs réels dans l'UI

**What to build:**
Refondre `FinancialPerformanceCard.tsx` pour afficher un graphique Recharts `AreaChart` avec 2 zones superposées (Capital Investi + Valorisation Portefeuille), un sélecteur de période temporelle fonctionnel (`1A`, `3A`, `Tout`), un tooltip enrichi affichant l'écart / la plus-value, un état vide propre en l'absence de données, et la mise à jour de la section "Aperçu Rapide" avec 4 KPIs dynamiques issus des données réelles du portefeuille.

**Blocked by:** 07 — Requête Backend Convex & Filtrage par Compte

**Status:** ready-for-agent

- [ ] Supprimer toutes les données ficitives (mock data)
- [ ] Implémenter le graphique à double courbe (Capital Investi vs Valorisation)
- [ ] Activer le filtre temporel (`1A`, `3A`, `Tout`)
- [ ] Gérer l'état vide (Empty State) sans crash ni faux graphiques
- [ ] Remplacer les textes statiques de l'Aperçu Rapide par des KPIs dynamiques calculés
