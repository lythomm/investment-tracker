# 05 — Monthly Snapshots & 5-10 Year History Charts

**What to build:**
Implement automatic monthly snapshot generation in Convex and build interactive, responsive long-term performance charts tracking Portfolio Valuation vs. Invested Capital month-by-month over a 5 to 10 year horizon.

**Blocked by:** 04 — Market Price API Sync & Portfolio Dashboard Metrics

**Status:** completed

## Acceptance Criteria

- [x] Convex cron / snapshot generation function computing end-of-month portfolio valuation and net deposits.
- [x] Retroactive snapshot recalculation trigger when historical transactions are modified.
- [x] Interactive 5-to-10 year chart component (Valuation curve vs. Invested Capital baseline curve).
- [x] Timeframe selector.
