"use client";

import { ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";
import { AssetHolding } from "../../convex/portfolio";

interface HoldingsTableProps {
  holdings: AssetHolding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-8 text-center">
        <Layers className="h-10 w-10 text-slate-600 mb-2" />
        <p className="text-sm font-medium text-slate-400">Aucun actif détenu dans le portefeuille.</p>
        <p className="text-xs text-slate-500 mt-1">
          Ajoutez un achat via le <span className="text-emerald-400">Formulaire DCA</span> pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Répartition & Positions</h3>
          <p className="text-xs text-slate-400">Détail des titres, PRU et plus-values latentes par actif</p>
        </div>
        <span className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-400">
          {holdings.length} actifs
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3 pt-1 font-semibold">Actif</th>
              <th className="pb-3 pt-1 font-semibold">Type</th>
              <th className="pb-3 pt-1 text-right font-semibold">Quantité</th>
              <th className="pb-3 pt-1 text-right font-semibold">PRU</th>
              <th className="pb-3 pt-1 text-right font-semibold">Cours Actuel</th>
              <th className="pb-3 pt-1 text-right font-semibold">Valeur Totale</th>
              <th className="pb-3 pt-1 text-right font-semibold">Plus-Value Latente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {holdings.map((item) => {
              const isPositive = item.unrealizedGainAmount >= 0;
              return (
                <tr key={item.assetId} className="hover:bg-slate-900/40 transition">
                  <td className="py-3">
                    <div className="font-bold text-white uppercase tracking-wide">{item.ticker}</div>
                    <div className="text-[11px] text-slate-400">{item.name}</div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        item.type === "ETF"
                          ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                          : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 text-right font-medium text-slate-200">
                    {item.totalQuantity.toLocaleString("fr-FR", { maximumFractionDigits: 4 })}
                  </td>
                  <td className="py-3 text-right font-medium text-slate-300">
                    {item.pru.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </td>
                  <td className="py-3 text-right font-semibold text-white">
                    {item.currentPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </td>
                  <td className="py-3 text-right font-bold text-white">
                    {item.currentValuation.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </td>
                  <td className="py-3 text-right">
                    <div
                      className={`font-bold flex items-center justify-end gap-1 ${
                        isPositive ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {isPositive ? "+" : ""}
                      {item.unrealizedGainAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </div>
                    <div
                      className={`text-[10px] ${
                        isPositive ? "text-emerald-500" : "text-rose-500"
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
