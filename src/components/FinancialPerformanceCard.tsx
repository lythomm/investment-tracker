"use client";

import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CheckCircle2, ChevronDown, TrendingUp, Wallet, Award, DollarSign, Info } from "lucide-react";

interface FinancialPerformanceCardProps {
  snapshots: Array<{
    yearMonth: string;
    totalInvested: number;
    totalValuation: number;
    totalGainAmount: number;
  }>;
  summary: {
    totalInvested: number;
    totalValuation: number;
    totalGainAmount: number;
    totalGainPercent: number;
    totalDividends: number;
    holdings: Array<{ ticker: string; currentValuation: number }>;
  };
}

function formatYearMonth(ym: string) {
  if (!ym || !ym.includes("-")) return ym;
  const [year, month] = ym.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  const monthName = date.toLocaleDateString("fr-FR", { month: "short" });
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year.slice(2)}`;
}

export function FinancialPerformanceCard({ snapshots, summary }: FinancialPerformanceCardProps) {
  const [timeframe, setTimeframe] = useState<"1Y" | "3Y" | "ALL">("ALL");

  // If there's only 1 snapshot, prepend a baseline (0 EUR) point for the previous month
  let rawSnapshots = [...snapshots];
  if (rawSnapshots.length === 1) {
    const [y, m] = rawSnapshots[0].yearMonth.split("-").map(Number);
    const prevDate = new Date(y, m - 2, 1);
    const prevYM = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
    rawSnapshots.unshift({
      yearMonth: prevYM,
      totalInvested: 0,
      totalValuation: 0,
      totalGainAmount: 0,
    });
  }

  // Filter snapshots according to selected timeframe
  let filteredSnapshots = rawSnapshots;
  if (timeframe === "1Y") {
    filteredSnapshots = filteredSnapshots.slice(-12);
  } else if (timeframe === "3Y") {
    filteredSnapshots = filteredSnapshots.slice(-36);
  }

  const chartData = filteredSnapshots.map((s) => ({
    name: formatYearMonth(s.yearMonth),
    rawYM: s.yearMonth,
    valuation: s.totalValuation,
    invested: s.totalInvested,
    gain: s.totalGainAmount,
  }));

  const topHolding =
    summary.holdings.length > 0
      ? [...summary.holdings].sort((a, b) => b.currentValuation - a.currentValuation)[0]
      : null;

  const isGainPositive = summary.totalGainAmount >= 0;

  return (
    <div className="space-y-6">
      {/* Top Chart Card: Financial Performance */}
      <div className="card-light rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-2xl font-normal text-main font-serif-display">
              Performance Financière
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Évolution comparative du capital investi et de la valeur totale
            </p>
          </div>
          {snapshots.length > 0 && (
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="appearance-none rounded-2xl bg-surface-subtle border border-subtle pl-3.5 pr-8 py-1.5 text-xs font-semibold text-main focus:outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <option value="1Y">1 An</option>
                <option value="3Y">3 Ans</option>
                <option value="ALL">Tout</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted pointer-events-none" />
            </div>
          )}
        </div>

        {/* Legend Header */}
        {snapshots.length > 0 && (
          <div className="flex items-center gap-4 text-xs mt-3 mb-4 pb-2 border-b border-subtle">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-600 inline-block" />
              <span className="text-main font-semibold">Valorisation Portefeuille</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" />
              <span className="text-muted font-medium">Capital Investi (Apports)</span>
            </div>
          </div>
        )}

        {snapshots.length === 0 ? (
          <div className="h-56 w-full flex flex-col items-center justify-center rounded-xl bg-surface-subtle p-6 text-center border border-dashed border-subtle">
            <TrendingUp className="h-8 w-8 text-muted mb-2" />
            <p className="text-sm font-semibold text-main">Aucun historique disponible</p>
            <p className="text-xs text-muted mt-1 max-w-xs">
              Ajoutez vos premières transactions d'achat pour suivre la performance temporelle de votre portefeuille.
            </p>
          </div>
        ) : (
          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="valuationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const valuation = payload.find((p) => p.dataKey === "valuation")?.value as number;
                      const invested = payload.find((p) => p.dataKey === "invested")?.value as number;
                      const gain = valuation - invested;
                      const gainPct = invested > 0 ? (gain / invested) * 100 : 0;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                          <p className="font-bold text-slate-300 border-b border-slate-700 pb-1">{label}</p>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Valorisation:</span>
                            <span className="font-semibold text-sky-400">{valuation.toLocaleString("fr-FR")} €</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Capital Investi:</span>
                            <span className="font-semibold text-slate-300">{invested.toLocaleString("fr-FR")} €</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
                            <span className="text-slate-400">Plus-value:</span>
                            <span className={`font-bold ${gain >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                              {gain >= 0 ? "+" : ""}{gain.toLocaleString("fr-FR")} € ({gainPct >= 0 ? "+" : ""}{gainPct.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#investedGradient)"
                  dot={{ r: 4, fill: "#94a3b8", strokeWidth: 1, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#64748b" }}
                />
                <Area
                  type="monotone"
                  dataKey="valuation"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#valuationGradient)"
                  dot={{ r: 5, fill: "#0284c7", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7, fill: "#0369a1" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Bottom Insights Card: Dynamic Quick Insights */}
      <div className="card-light rounded-2xl p-6 sm:p-8">
        <h3 className="text-2xl font-normal text-main font-serif-display mb-4">
          Aperçu Rapide
        </h3>

        <ul className="space-y-4 text-sm text-main">
          <li className="flex items-start gap-3">
            <TrendingUp className={`h-5 w-5 shrink-0 mt-0.5 ${isGainPositive ? "text-emerald-500" : "text-rose-500"}`} />
            <span>
              Plus-value latente globale :{" "}
              <strong className={`font-bold ${isGainPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {isGainPositive ? "+" : ""}
                {summary.totalGainAmount.toLocaleString("fr-FR")} € ({isGainPositive ? "+" : ""}
                {summary.totalGainPercent.toFixed(1)}%)
              </strong>.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Wallet className="h-5 w-5 text-muted shrink-0 mt-0.5" />
            <span>
              Apports cumulés :{" "}
              <strong className="text-main font-bold">
                {summary.totalInvested.toLocaleString("fr-FR")} €
              </strong>{" "}
              déposés au total.
            </span>
          </li>
          {topHolding ? (
            <li className="flex items-start gap-3">
              <Award className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Actif principal :{" "}
                <strong className="text-main font-bold uppercase">{topHolding.ticker}</strong> (
                {topHolding.currentValuation.toLocaleString("fr-FR")} €).
              </span>
            </li>
          ) : (
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-muted shrink-0 mt-0.5" />
              <span>Aucun actif en portefeuille pour le moment.</span>
            </li>
          )}
          <li className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Dividendes cumulés perçus :{" "}
              <strong className="text-main font-bold">
                {summary.totalDividends.toLocaleString("fr-FR")} €
              </strong>.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
