"use client";

import { ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";
import { AssetHolding } from "../../convex/portfolio";

interface HoldingsTableProps {
  holdings: AssetHolding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="card-light flex flex-col items-center justify-center rounded-[2.25rem] p-12 text-center bg-white border border-slate-200">
        <Layers className="h-10 w-10 text-slate-300 mb-2" />
        <p className="text-base font-medium text-slate-600 font-serif-display">Aucun actif détenu dans le portefeuille.</p>
        <p className="text-xs text-slate-400 mt-1">
          Ajoutez un achat via le bouton <span className="text-slate-900 font-bold">DCA du Mois</span> pour démarrer.
        </p>
      </div>
    );
  }

  return (
    <div className="card-light rounded-[2.25rem] p-6 sm:p-8 bg-white border border-slate-200">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-normal text-slate-900 font-serif-display">
            Positions & Répartition
          </h2>
          <p className="text-xs text-slate-500">Détail des titres, PRU et plus-values latentes par actif</p>
        </div>
        <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
          {holdings.length} actifs
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium">
              <th className="pb-3 pl-2">Actif</th>
              <th className="pb-3">Type</th>
              <th className="pb-3 text-right">Quantité</th>
              <th className="pb-3 text-right">PRU</th>
              <th className="pb-3 text-right">Cours Actuel</th>
              <th className="pb-3 text-right">Valeur Totale</th>
              <th className="pb-3 text-right pr-2">Plus-Value Latente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {holdings.map((item) => {
              const isPositive = item.unrealizedGainAmount >= 0;
              return (
                <tr key={item.assetId} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 pl-2">
                    <div className="font-bold text-slate-900 uppercase tracking-wide">{item.ticker}</div>
                    <div className="text-[11px] text-slate-500">{item.name}</div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        item.type === "ETF"
                          ? "bg-sky-50 text-sky-700 border border-sky-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 text-right font-medium text-slate-700">
                    {item.totalQuantity.toLocaleString("fr-FR", { maximumFractionDigits: 4 })}
                  </td>
                  <td className="py-4 text-right font-medium text-slate-600">
                    {item.pru.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </td>
                  <td className="py-4 text-right font-semibold text-slate-900">
                    {item.currentPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </td>
                  <td className="py-4 text-right font-bold text-slate-900">
                    {item.currentValuation.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </td>
                  <td className="py-4 text-right pr-2">
                    <div
                      className={`font-bold flex items-center justify-end gap-1 ${
                        isPositive ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {isPositive ? "+" : ""}
                      {item.unrealizedGainAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </div>
                    <div
                      className={`text-[10px] ${
                        isPositive ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      ({isPositive ? "+" : ""}
                      {item.unrealizedGainPercent.toFixed(2)}%)
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
