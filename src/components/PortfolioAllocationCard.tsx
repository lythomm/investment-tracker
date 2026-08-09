"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface PortfolioAllocationCardProps {
  holdings: Array<{
    ticker: string;
    name: string;
    currentValuation: number;
  }>;
  totalValuation: number;
}

const COLORS = [
  "#0284c7", // Sky
  "#10b981", // Emerald
  "#8b5cf6", // Violet
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f97316", // Orange
];

export function PortfolioAllocationCard({ holdings, totalValuation }: PortfolioAllocationCardProps) {
  const activeHoldings = holdings
    .filter((h) => h.currentValuation > 0)
    .sort((a, b) => b.currentValuation - a.currentValuation);

  const chartData = activeHoldings.map((h) => ({
    name: h.ticker,
    fullName: h.name,
    value: h.currentValuation,
    percent: totalValuation > 0 ? (h.currentValuation / totalValuation) * 100 : 0,
  }));

  return (
    <div className="card-light rounded-2xl p-6 sm:p-8 bg-white h-full flex flex-col justify-between space-y-6">
      <div>
        <h3 className="text-2xl font-normal text-slate-900 font-serif-display">
          Répartition par Actif
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Ventilation du capital selon la valeur de chaque position
        </p>
      </div>

      {activeHoldings.length === 0 ? (
        <div className="h-64 w-full flex flex-col items-center justify-center rounded-xl bg-slate-50 p-6 text-center border border-dashed border-slate-200">
          <PieChartIcon className="h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-700">Aucune position active</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Ajoutez votre premier achat pour voir le camembert de répartition de votre portefeuille.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Donut Chart with Center Text */}
          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                          <p className="font-bold text-sky-400 uppercase">{item.name}</p>
                          <p className="text-slate-300 text-[11px]">{item.fullName}</p>
                          <div className="flex justify-between gap-4 pt-1 border-t border-slate-800 mt-1">
                            <span className="text-slate-400">Valeur:</span>
                            <span className="font-semibold text-white">
                              {Number(item.value).toLocaleString("fr-FR")} € ({Number(item.percent).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Total Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs font-medium text-slate-400">Total</span>
              <span className="text-lg font-bold text-slate-900">
                {totalValuation.toLocaleString("fr-FR")} €
              </span>
            </div>
          </div>

          {/* Allocation Legend List */}
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {chartData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-3 w-3 rounded-full shrink-0 inline-block"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="font-bold text-slate-900 uppercase truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-500 font-medium">{item.value.toLocaleString("fr-FR")} €</span>
                  <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                    {item.percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
