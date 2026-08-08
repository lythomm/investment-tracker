"use client";

import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { CheckCircle2, TrendingUp, Sparkles } from "lucide-react";

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
    holdings: Array<{ ticker: string; currentValuation: number }>;
  };
}

export function FinancialPerformanceCard({ snapshots, summary }: FinancialPerformanceCardProps) {
  const [timeframe, setTimeframe] = useState<"MONTHLY" | "ALL">("MONTHLY");

  const chartData = (snapshots.length > 0 ? snapshots : [
    { yearMonth: "Jan", totalValuation: 21000 },
    { yearMonth: "Fév", totalValuation: 21800 },
    { yearMonth: "Mar", totalValuation: 22400 },
    { yearMonth: "Avr", totalValuation: 23100 },
    { yearMonth: "Mai", totalValuation: 24540 },
  ]).map((s) => ({
    name: s.yearMonth,
    val: s.totalValuation,
  }));

  const topHolding = summary.holdings.length > 0
    ? [...summary.holdings].sort((a, b) => b.currentValuation - a.currentValuation)[0]
    : null;

  return (
    <div className="space-y-6">
      {/* Top Chart Card */}
      <div className="card-fintech rounded-3xl p-6 shadow-xl border border-slate-800/80 bg-slate-900/70">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Performance Financière</h3>
            <p className="text-xs text-slate-400">Évolution de la valeur du portefeuille</p>
          </div>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300 focus:outline-none"
          >
            <option value="MONTHLY">Mensuel</option>
            <option value="ALL">Tout l'historique</option>
          </select>
        </div>

        {/* Minimal Smooth Wave Chart */}
        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="fintechWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#fff",
                }}
                formatter={(val: any) => [`${Number(val).toLocaleString("fr-FR")} €`, "Valeur"]}
              />
              <Area
                type="monotone"
                dataKey="val"
                stroke="#38bdf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#fintechWave)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Quick Insights Card */}
      <div className="card-fintech rounded-3xl p-6 shadow-xl border border-slate-800/80 bg-slate-900/70">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Aperçu & Insights</h3>
        </div>

        <ul className="space-y-3 text-xs text-slate-300">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Rendement latent global : <strong className="text-white">+{summary.totalGainPercent.toFixed(2)}%</strong>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Capital apporté cumulé : <strong className="text-white">{summary.totalInvested.toLocaleString("fr-FR")} €</strong>
            </span>
          </li>
          {topHolding && (
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                Plus grosse ligne : <strong className="text-white uppercase">{topHolding.ticker}</strong> ({topHolding.currentValuation.toLocaleString("fr-FR")} €)
              </span>
            </li>
          )}
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
            <span>Saisie DCA mensuelle simplifiée en 1 clic</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
