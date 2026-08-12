"use client";

import Link from "next/link";
import { Layers, Plus } from "lucide-react";
import { Button } from "./ui/Button";

interface HoldingsTableProps {
  holdings: Array<{
    assetId: string;
    ticker: string;
    name: string;
    type?: "ETF" | "Action";
    assetType?: "ETF" | "Action";
    totalQuantity: number;
    pru?: number;
    averageBuyPrice?: number;
    totalInvestedCost?: number;
    totalInvested?: number;
    currentPrice: number;
    currentValuation: number;
    unrealizedGainAmount?: number;
    gainAmount?: number;
    unrealizedGainPercent?: number;
    gainPercent?: number;
  }>;
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center rounded-2xl p-16 text-center">
        <Layers className="h-12 w-12 text-muted mb-3" />
        <p className="text-lg font-medium text-muted font-serif-display">
          Aucun actif détenu dans le portefeuille.
        </p>
        <Link href="/transactions/new" className="mt-4">
          <Button variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
            Ajouter une transaction
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="card rounded-2xl p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-normal text-main font-serif-display">
          Positions Ouvertes
        </h2>
        <p className="text-sm text-muted mt-1">
          Détail de tous vos ETF et Actions détenus en portefeuille.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="text-muted font-semibold text-xs uppercase tracking-wide border-b border-subtle">
              <th className="py-3 px-4 sm:px-6">Ticker / Nom</th>
              <th className="py-3 px-4 sm:px-6">Type</th>
              <th className="py-3 px-4 sm:px-6 text-right">Quantité</th>
              <th className="py-3 px-4 sm:px-6 text-right">PRU</th>
              <th className="py-3 px-4 sm:px-6 text-right">Prix Actuel</th>
              <th className="py-3 px-4 sm:px-6 text-right">Valorisation</th>
              <th className="py-3 px-4 sm:px-6 text-right">Plus-Value</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const investedCost = h.totalInvestedCost ?? h.totalInvested ?? 0;
              const gainAmount = h.unrealizedGainAmount ?? h.gainAmount ?? (h.currentValuation - investedCost);
              const gainPercent =
                h.unrealizedGainPercent ??
                h.gainPercent ??
                (investedCost > 0 ? (gainAmount / investedCost) * 100 : 0);
              const pru = h.pru ?? h.averageBuyPrice ?? (h.totalQuantity > 0 ? investedCost / h.totalQuantity : 0);
              const isPositive = gainAmount >= 0;
              const assetType = h.type || h.assetType || "ETF";
              const fullName = h.name || h.ticker;
              const mobileName = fullName.length > 20 ? `${fullName.slice(0, 20)}...` : fullName;

              return (
                <tr
                  key={h.assetId}
                  className="hover:bg-surface-hover transition border-b border-subtle last:border-0"
                >
                  <td className="py-4 px-4 sm:px-6 font-medium text-main">
                    <div className="font-bold text-base text-main uppercase">{h.ticker}</div>
                    <div className="text-xs text-muted" title={fullName}>
                      <span className="sm:hidden">{mobileName}</span>
                      <span className="hidden sm:inline">{fullName}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-main font-medium">
                    <span className="rounded-2xl bg-surface-subtle border border-subtle px-3 py-1 text-xs font-semibold text-main">
                      {assetType}
                    </span>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right font-medium text-main">
                    {h.totalQuantity}
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right text-muted">
                    {pru.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right text-muted">
                    {h.currentPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right font-bold text-base text-main">
                    {h.currentValuation.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right font-bold">
                    <div className={isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                      {isPositive ? "+" : ""}
                      {gainAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </div>
                    <div className={`text-xs ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                      {isPositive ? "+" : ""}
                      {gainPercent.toFixed(2)}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
