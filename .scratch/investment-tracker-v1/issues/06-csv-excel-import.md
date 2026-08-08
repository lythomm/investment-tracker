# 06 — CSV / Excel Import Module

**What to build:**
Create a 1-click import feature allowing users migrating from Excel to upload a CSV file of past transactions, map columns, preview parsed entries, and execute a batch creation of their transaction history.

**Blocked by:** 03 — Fast DCA Batch Entry Form UI & Single Entry Modal

**Status:** completed

## Acceptance Criteria

- [x] File upload component accepting CSV/Excel files.
- [x] Column mapper & data preview step (Date, Account, Ticker, Type, Quantity, Unit Price, Fees).
- [x] Batch import mutation inserting all validated transactions and triggering snapshot recalculations.
- [x] Clear error feedback for invalid rows or unrecognized tickers.
