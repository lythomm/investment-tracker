# Folio - Domain Context (Glossary)

## Portfolio & Accounts

- **Compte d'Investissement** : Enveloppe fiscale de détention d'actifs. Types supportés en V1 : `PEA` (Plan d'Épargne en Actions), `CTO` (Compte Titres Ordinaire).
- **Actif (Asset)** : Instrument financier négociable. Types supportés en V1 : `ETF`, `Action`. Identifié par un symbole (Ticker) et un code ISIN.

## Transactions & Ledger

- **Transaction** : Enregistrement d'une opération sur un actif au sein d'un compte. Types supportés :
  - `ACHAT` : Acquisition de N unités à un prix P avec frais F.
  - `VENTE` : Cession de N unités à un prix P avec frais F.
  - `DIVIDENDE` : Revenu perçu associé à un actif détenu.
- **Règle de Gestion (Hors-Cash)** : L'application ne gère pas de poche de liquidités (solde espèces). Seuls les flux d'achats/ventes/dividendes sur les actifs sont enregistrés.
- **Montant Investi (Total Capital Deposited)** : Somme cumulée des achats (`Quantité * Prix + Frais`) moins les ventes (`Quantité * Prix - Frais`).
- **Saisie DCA Mensuelle (Batch Entry)** : Formulaire optimisé permettant à l'investisseur d'enregistrer plusieurs achats simultanément pour son point mensuel.
- **Importation Initial Excel / CSV** : Fonctionnalité de migration d'historique permettant d'importer les transactions d'un fichier Excel/CSV existant en 1 clic.

## Financial Metrics & Long-Term History

- **PRU (Prix de Revient Unitaire)** : Prix moyen d'acquisition par titre recalculé à chaque achat : `(Σ (Quantité Achetée * Prix) + Σ Frais) / Quantité Totale Détenue`.
- **Valeur du Portefeuille** : `Σ (Quantité Détenue par Actif * Cours Actuel du Marché)`.
- **Plus-Value Latente** : `Valeur du Portefeuille - Montant Investi` (exprimée en euros et en pourcentage `%`).
- **Snapshot Mensuel** : Agrégat historique généré/calculé à la fin de chaque mois calendaire enregistrant la valeur totale, le montant investi et la plus-value latente pour l'affichage des graphiques 5-10 ans.
