# 04 — Market Price API Sync & Portfolio Dashboard Metrics

**What to build:**
Integrate a third-party market data API to periodically refresh asset quotes and build the main portfolio dashboard displaying total portfolio valuation, net invested capital, PRU breakdown, and unrealized capital gains (€ and %).

**Blocked by:** 03 — Fast DCA Batch Entry Form UI & Single Entry Modal

**Status:** completed

## Acceptance Criteria

- [x] Market price fetch action integration caching current quotes in Convex.
- [x] Portfolio dashboard summary card displaying Valuation, Capital Invested, Gain (€), and Gain (%).
- [x] Asset holdings breakdown table showing Quantity, PRU, Current Price, Current Value, and P&L per position.
- [x] Account filter toggle (All Accounts, PEA only, CTO only).
