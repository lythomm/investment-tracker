# 02 — Account Management & Asset Ledger Backend

**What to build:**
Implement Convex queries and mutations to manage investment accounts (PEA, CTO), assets (ETF, Actions), and log transactions (ACHAT, VENTE, DIVIDENDE). Include PRU (weighted average purchase price) and net capital invested calculations covered by `convex-test` unit tests.

**Blocked by:** 01 — Project Setup, Convex Schema & Convex Auth

**Status:** completed

## Acceptance Criteria

- [x] Mutations to create and list PEA and CTO accounts per authenticated user.
- [x] Mutations to add, edit, and delete transactions (`ACHAT`, `VENTE`, `DIVIDENDE`).
- [x] Query calculating current asset quantities, PRU per title, and total net invested capital per account.
- [x] Unit tests written using `convex-test` verifying PRU calculations, transactions, and multi-user data isolation.
