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
      <div className="card-light rounded-[2.25rem] p-6 bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-normal text-slate-900 font-serif-display">
            Financial Performance
          </h3>
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="appearance-none rounded-full border border-slate-200 bg-white pl-3 pr-7 py-1 text-xs font-medium text-slate-600 focus:outline-none shadow-xs"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="ALL">Last 7 Days</option>
            </select>
            <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Smooth Blue Wave Area Chart */}
        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="fintecoLightWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0284c7",
                  borderColor: "#0284c7",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#fff",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
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
      <div className="card-light rounded-[2.25rem] p-6 bg-white border border-slate-100 shadow-sm">
        <h3 className="text-xl font-normal text-slate-900 font-serif-display mb-4">
          Quick Insights
        </h3>

        <ul className="space-y-3 text-xs text-slate-600">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Rendement latent global : <strong className="text-slate-900">+{summary.totalGainPercent.toFixed(1)}%</strong> ce mois-ci.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Apports cumulés : <strong className="text-slate-900">{summary.totalInvested.toLocaleString("fr-FR")} €</strong> déposés.
            </span>
          </li>
          {topHolding && (
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Premier actif : <strong className="text-slate-900 uppercase">{topHolding.ticker}</strong> ({topHolding.currentValuation.toLocaleString("fr-FR")} €).
              </span>
            </li>
          )}
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span>Saisie DCA mensuelle simplifiée en 1 clic.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
