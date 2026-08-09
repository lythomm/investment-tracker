"use client";

import { Layers } from "lucide-react";

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
      <div className="card-light flex flex-col items-center justify-center rounded-2xl p-16 text-center bg-white">
        <Layers className="h-12 w-12 text-slate-300 mb-3" />
        <p className="text-lg font-medium text-slate-600 font-serif-display">
          Aucun actif détenu dans le portefeuille.
        </p>
      </div>
    );
  }

  return (
    <div className="card-light rounded-2xl p-6 sm:p-8 bg-white">
      <div className="mb-6">
        <h2 className="text-3xl font-normal text-slate-900 font-serif-display">
          Positions Ouvertes
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Détail de tous vos ETF et Actions détenus en portefeuille.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 font-semibold text-xs uppercase tracking-wide">
              <th className="pb-3 pl-2">Ticker / Nom</th>
              <th className="pb-3">Type</th>
              <th className="pb-3 text-right">Quantité</th>
              <th className="pb-3 text-right">PRU</th>
              <th className="pb-3 text-right">Prix Actuel</th>
              <th className="pb-3 text-right">Valorisation</th>
              <th className="pb-3 text-right pr-2">Plus-Value</th>
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

              return (
                <tr key={h.assetId} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 pl-2 font-medium text-slate-900">
                    <div className="font-bold text-base text-slate-900 uppercase">{h.ticker}</div>
                    <div className="text-xs text-slate-500">{h.name}</div>
                  </td>

                  <td className="py-4 text-slate-700 font-medium">
                    <span className="rounded-2xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {assetType}
                    </span>
                  </td>

                  <td className="py-4 text-right font-medium text-slate-900">
                    {h.totalQuantity}
                  </td>

                  <td className="py-4 text-right text-slate-700">
                    {pru.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </td>

                  <td className="py-4 text-right text-slate-700">
                    {h.currentPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </td>

                  <td className="py-4 text-right font-bold text-base text-slate-900">
                    {h.currentValuation.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </td>

                  <td className="py-4 text-right pr-2 font-bold">
                    <div className={isPositive ? "text-emerald-700" : "text-rose-600"}>
                      {isPositive ? "+" : ""}
                      {gainAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </div>
                    <div className={`text-xs ${isPositive ? "text-emerald-600" : "text-rose-500"}`}>
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
