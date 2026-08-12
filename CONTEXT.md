# Folio - Domain Context (Glossary)

## Portfolio & Accounts

- **Compte d'Investissement** : Enveloppe fiscale de détention d'actifs. Types supportés : `PEA` (Plan d'Épargne en Actions), `CTO` (Compte Titres Ordinaire), `PER` (Plan d'Épargne Retraite), `ASSURANCE_VIE`, `CRYPTO`, `SCPI`.
- **Actif (Asset)** : Instrument financier négociable. Types supportés : `ETF`, `Action`, `Crypto`, `SCPI`. Identifié par un symbole (Ticker) et/ou un code ISIN.

## Transactions & Ledger

- **Transaction** : Enregistrement d'une opération sur un actif au sein d'un compte. Types supportés :
  - `ACHAT` : Acquisition de N unités à un prix P avec frais F.
  - `VENTE` : Cession de N unités à un prix P avec frais F.
  - `DIVIDENDE` : Revenu perçu associé à un actif détenu.
- **Règle de Gestion (Hors-Cash)** : L'application ne gère pas de poche de liquidités (solde espèces). Seuls les flux d'achats/ventes/dividendes sur les actifs sont enregistrés.
- **Philosophie Produit** : Alternative moderne et fluide aux tableaux Excel de suivi d'investissement mensuel. Simplicité visuelle prime sur la complexité institutionnelle.
- **Montant Investi (Total Capital Deposited)** : Somme cumulée des achats (`Quantité * Prix + Frais`) moins les ventes (`Quantité * Prix - Frais`).
- **Saisie Multistep de Transaction** : Formulaire guidé en 4 étapes (`Type` -> `Compte` -> `Recherche Ticker/Actif avec autocomplétion Yahoo Finance` -> `Quantité/Prix/Frais/Date`) remplaçant l'ancienne modal unique.
- **Saisie DCA Mensuelle (Batch Entry)** : Formulaire optimisé permettant à l'investisseur d'enregistrer plusieurs achats simultanément pour son point mensuel.
- **Importation Initial Excel / CSV** : Fonctionnalité de migration d'historique permettant d'importer les transactions d'un fichier Excel/CSV existant en 1 clic.
- **Édition et Suppression de Transaction** : Modale interactive ouverte au clic sur une ligne de tableau permettant de consulter, modifier ou supprimer avec confirmation n'importe quelle transaction existante.


## Financial Metrics & Long-Term History

- **PRU (Prix de Revient Unitaire)** : Prix moyen d'acquisition par titre recalculé à chaque achat : `(Σ (Quantité Achetée * Prix) + Σ Frais) / Quantité Totale Détenue`.
- **Valeur du Portefeuille** : `Σ (Quantité Détenue par Actif * Cours Actuel du Marché)`.
- **Plus-Value Latente** : `Valeur du Portefeuille - Montant Investi` (exprimée en euros et en pourcentage `%`). Présentée en métrique principale sur le tableau de bord.
- **TWR (Time-Weighted Return / Rentabilité Pondérée par le Temps)** : Taux de performance neutralisant l'impact des apports/retraits de capital, disponible dans l'onglet **Analytics**.
- **Yield on Cost (YOC)** : Ratio entre les dividendes annuels perçus par titre et le Prix de Revient Unitaire (PRU) total dudit titre.
- **Calculateur de Rebalancement DCA** : Outil suggérant le montant exact à acheter sur chaque ETF/Actif pour rapprocher le portefeuille de l'allocation cible choisie (ex: 80% World / 20% Emerging).
- **Snapshot Mensuel** : Agrégat historique généré/calculé à la fin de chaque mois calendaire enregistrant la valeur totale, le montant investi et la plus-value latente pour l'affichage des graphiques 5-10 ans.
