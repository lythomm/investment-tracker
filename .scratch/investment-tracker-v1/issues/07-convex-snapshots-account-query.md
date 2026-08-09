# 07 — Requête Backend Convex & Filtrage par Compte

**What to build:**
Mettre à jour la query Convex `getMonthlySnapshots` pour qu'elle accepte `accountId` (optionnel).
Si des snapshots mensuels existent pour l'utilisateur (et le compte s'il est spécifié), les retourner. Sinon, calculer dynamiquement la série temporelle mois par mois à partir du livre de transactions (`transactions`).
Connecter `selectedAccountId` dans `page.tsx` lors de l'appel à `api.snapshots.getMonthlySnapshots`.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `getMonthlySnapshots` accepte `accountId: v.optional(v.union(v.null(), v.id("accounts")))`
- [ ] Filtrage correct des snapshots et des transactions par compte et par utilisateur (`userId`)
- [ ] Calcul dynamique des points historiques si aucun snapshot enregistré
- [ ] Transmission de `selectedAccountId` depuis `src/app/page.tsx`
