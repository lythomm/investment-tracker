"use client";

import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { CheckCircle2, ChevronDown } from "lucide-react";

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
      {/* Top Chart Card: Financial Performance */}
      <div className="card-light rounded-2xl p-6 sm:p-8 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-normal text-slate-900 font-serif-display">
            Performance Financière
          </h3>
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="appearance-none rounded-2xl bg-slate-100 pl-4 pr-8 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="MONTHLY">Mensuel</option>
              <option value="ALL">Historique global</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Smooth Blue Wave Area Chart */}
        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="fintecoLightWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0284c7",
                  border: "none",
                  borderRadius: "16px",
                  fontSize: "12px",
                  color: "#fff",
                  boxShadow: "none",
                }}
                formatter={(val: any) => [`${Number(val).toLocaleString("fr-FR")} €`, "Valeur"]}
              />
              <Area
                type="monotone"
                dataKey="val"
                stroke="#0284c7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#fintecoLightWave)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Insights Card: Quick Insights */}
      <div className="card-light rounded-2xl p-6 sm:p-8 bg-white">
        <h3 className="text-2xl font-normal text-slate-900 font-serif-display mb-4">
          Aperçu Rapide
        </h3>

        <ul className="space-y-4 text-sm text-slate-700">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Rendement latent global : <strong className="text-slate-900 font-bold">+{summary.totalGainPercent.toFixed(1)}%</strong> ce mois-ci.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Apports cumulés : <strong className="text-slate-900 font-bold">{summary.totalInvested.toLocaleString("fr-FR")} €</strong> déposés.
            </span>
          </li>
          {topHolding && (
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Premier actif : <strong className="text-slate-900 font-bold uppercase">{topHolding.ticker}</strong> ({topHolding.currentValuation.toLocaleString("fr-FR")} €).
              </span>
            </li>
          )}
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <span>Saisie DCA mensuelle simplifiée en 1 clic.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
