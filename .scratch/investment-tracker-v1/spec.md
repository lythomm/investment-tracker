# Spec: Investment Tracker V1 (Excel Killer)

Status: ready-for-agent

## Problem Statement

Les investisseurs particuliers pratiquant le DCA (Dollar-Cost Averaging) mensuel manquent d'un outil moderne et adapté au smartphone pour suivre l'évolution de leurs investissements (ETF, Actions) sur PEA et CTO. Les tableaux Excel traditionnels sont rudimentaires, difficiles à mettre à jour sur mobile, nécessitent des calculs manuels complexes pour le PRU et l'historique sur 5-10 ans, et manquent d'ergonomie et de réactivité.

## Solution

Une application web réactive, mobile-first et moderne (Next.js + Convex) au design Dark FinTech. Elle permet aux investisseurs de saisir en 30 secondes leurs achats mensuels par lot (formulaire DCA) ou d'importer leur historique Excel/CSV en 1 clic. L'application calcule automatiquement les PRU, la valeur actuelle via API bourse, la plus-value latente et génère des agrégats mensuels pour restituer des graphiques d'évolution long terme (5-10 ans) fluides et instantanés.

## User Stories

1. As an investor, I want to authenticate securely using Convex Auth, so that my personal financial data remains private and isolated.
2. As an investor, I want to create investment accounts (PEA, CTO), so that I can categorize my holdings by tax wrapper.
3. As an investor, I want to log a single purchase transaction (asset, quantity, price, fees, date, account), so that I can track individual acquisitions.
4. As an investor, I want to log batch monthly DCA transactions via a multi-line fast form, so that I can register all monthly purchases in under 30 seconds without creating transactions one by one.
5. As an investor, I want to log sale transactions, so that I can reduce position sizes and update my invested capital correctly.
6. As an investor, I want to log dividend income received on assets, so that I can track yield without skewing my invested capital calculations.
7. As an investor, I want to import my past transaction history from a CSV or Excel file, so that I can migrate from my old spreadsheet without manual re-entry.
8. As an investor, I want to see the weighted average purchase price (PRU) per asset, so that I know my break-even price.
9. As an investor, I want to see real-time market prices for my assets, so that I can see the current total value of my portfolio.
10. As an investor, I want to view my unrealized capital gains/losses in euros and percentage, so that I can assess my portfolio performance.
11. As an investor, I want to see the total invested capital (net deposits), so that I know how much of my own money is in the portfolio.
12. As an investor, I want to view interactive 5-to-10 year portfolio growth charts (Valuation vs. Invested Capital), so that I can track my long-term wealth accumulation.
13. As an investor, I want a mobile-first UI with dark mode and glassmorphism styling, so that I can comfortably check and update my investments from my phone anytime.
14. As an investor, I want to filter my dashboard by account (All, PEA only, CTO only), so that I can analyze performance per envelope.
15. As an investor, I want to edit or delete past transactions, so that I can correct input mistakes and automatically trigger retroactive snapshot recalculations.

## Implementation Decisions

- **Frontend Framework**: Next.js App Router with TypeScript and Tailwind CSS using a Dark Mode FinTech design system (glassmorphism cards, subtle gradients, green/red gain indicators).
- **Reactive Backend**: Convex backend functions (`queries` and `mutations`) for real-time reactivity and data consistency.
- **Authentication**: `@convex-dev/auth` for user identity and data isolation per user.
- **Data Model (Pure Asset Ledger)**:
  - No cash pocket / balance tracking; financial metrics rely purely on asset transactions (`ACHAT`, `VENTE`, `DIVIDENDE`).
  - Tables: `users`, `accounts` (PEA, CTO), `assets` (ticker, ISIN, type, current_price), `transactions` (user_id, account_id, asset_id, type, quantity, price, fees, date), `monthly_snapshots` (user_id, year_month, total_invested, total_valuation, total_gain).
- **Market Data Fetching**: Integration with a third-party market data API (e.g. Yahoo Finance / Alpha Vantage) cached in Convex to refresh asset prices periodically.
- **Long-Term Performance Aggregation**:
  - Event sourcing logic to compute PRU and monthly balances from transaction history.
  - Automatic `monthly_snapshots` generation to render 5-10 year charts instantly without scanning all raw transactions on every page load.
- **Import Module**: CSV parser mapping columns (Date, Account, Asset/Ticker, Type, Quantity, Price, Fees) into batch `transactions` mutations.

## Testing Decisions

- **Primary Seam 1 (Convex Backend Unit & Integration Tests)**:
  - Use `convex-test` to test backend queries and mutations in isolation.
  - Validate PRU calculation logic, net capital invested rules, dividend accounting, and monthly snapshot generation.
  - Verify strict user data scoping (users can only access their own accounts and transactions).
- **Secondary Seam 2 (UI Component & E2E Integration Tests)**:
  - Test DCA batch entry form state and validation.
  - Test CSV file import parsing and error handling.
  - Verify mobile navigation and chart rendering.

## Out of Scope

- Cash balance / bank account synchronization (no cash pocket in V1).
- Crypto assets, real estate, or savings account tracking (PEA and CTO with ETFs and Stocks only for V1).
- Automated open-banking sync (manual entry and CSV import only).
- Tax reporting / IFU calculation.

## Further Notes

- Documented in project domain files:
  - Glossary: [`CONTEXT.md`](file:///c:/Users/Thomas/workspace/myProjects/investment-tracker/CONTEXT.md)
  - Architectural Decisions: [`docs/adr/`](file:///c:/Users/Thomas/workspace/myProjects/investment-tracker/docs/adr/)
