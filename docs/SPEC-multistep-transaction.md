# Feature Spec: Formulaire Multistep d'Ajout de Transaction avec Autocomplétion Yahoo Finance

## Problem Statement

L'ajout d'une transaction via une modal unique pose des problèmes d'ergonomie (surcharge visuelle, particulièrement sur mobile) et favorise les erreurs de saisie manuelle des Tickers d'actifs sans validation ni autocomplétion.

## Solution

Remplacer la modal d'ajout de transaction par une page dédiée `/transactions/new` avec un formulaire guidé en 4 étapes claires, intégrant la recherche dynamique avec autocomplétion des Tickers et la récupération automatique du nom de l'actif et de son cours de marché actuel via Yahoo Finance.

## User Stories

1. As an investor, I want to click any "Ajouter une transaction" button in the application, so that I am navigated to a clean dedicated page instead of a crowded modal.
2. As an investor, I want to select the transaction type (Achat, Vente, Dividende) in step 1, so that the application configures the transaction context immediately.
3. As an investor, I want to select the destination investment account (PEA, CTO) in step 2, so that the transaction is correctly attached to my portfolio envelope.
4. As an investor, I want to type the first letters of a Ticker or asset name in step 3 and receive live autocomplete suggestions, so that I don't make typing mistakes.
5. As an investor, I want the system to automatically retrieve the full asset name and current market price from Yahoo Finance when selecting a new asset, so that I don't have to enter them manually.
6. As an investor, I want to fill in quantity, unit price, fees, and transaction date in step 4, so that all financial details are captured accurately.
7. As an investor, I want to navigate backward and forward between steps without losing my inputs, so that I can make corrections before submitting.
8. As an investor, I want to submit the completed form and be redirected to the transactions history page with immediate visual feedback, so that I know my operation was successfully recorded.

## Implementation Decisions

- **Dedicated Route**: Creation of `/transactions/new` client component containing the 4-step wizard state machine.
- **Backend Search Proxy**: Implementation of a Next.js API route `/api/assets/search` acting as a secure, debounced backend proxy to the Yahoo Finance search API.
- **Local DB Fallback**: Prioritize local lookup against the Convex `assets` table before dispatching external API search queries.
- **State Handling**: Manage step index (1 to 4) and transient transaction draft state locally within the page component, preserving values across step transitions.
- **Asset Persistence**: Call `getOrCreateAsset` Convex mutation to persist or resolve the target asset ID (storing ticker, full name, type, and current price), followed by `addTransaction` Convex mutation upon final step submission.
- **Modal Deprecation**: Remove `AddTransactionModal.tsx` and re-route all call-to-action triggers directly to `/transactions/new`.

## Testing Decisions

- **Testing Seam**: The primary seam is the **Page Integration Layer** (`/transactions/new` page container) mocking backend API responses for ticker autocomplete and verifying step progression from Step 1 to Step 4, ending with the payload delivered to `addTransaction`.
- **Behavioral Focus**: Verify user interactions across step transitions, debounced autocomplete rendering, form validation (preventing progression if required fields are missing), and post-submission redirection.

## Out of Scope

- Editing or modifying existing transactions via the multistep interface (only creation of new transactions is covered).
- CSV / Excel batch import modification (remains covered by `CsvImportModal`).
- DCA batch purchase modification (remains covered by `DcaBatchModal`).

## Further Notes

- Respects domain terminology defined in `CONTEXT.md`.
- Architectural rationale recorded in `docs/adr/0007-multistep-transaction-page-with-yahoo-search.md`.
