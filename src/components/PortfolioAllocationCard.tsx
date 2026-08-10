"use client";

import { useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeHoldings = holdings
    .filter((h) => h.currentValuation > 0)
    .sort((a, b) => b.currentValuation - a.currentValuation);

  const chartData = activeHoldings.map((h) => ({
    name: h.ticker,
    fullName: h.name,
    value: h.currentValuation,
    percent: totalValuation > 0 ? (h.currentValuation / totalValuation) * 100 : 0,
  }));

  const activeItem = activeIndex !== null ? chartData[activeIndex] : null;

  return (
    <div className="card-light rounded-2xl p-6 sm:p-8 h-full flex flex-col justify-between space-y-6">
      <div>
        <h3 className="text-2xl font-normal text-main font-serif-display">
          Répartition par Actif
        </h3>
        <p className="text-xs text-muted mt-0.5">
          Ventilation du capital selon la valeur de chaque position
        </p>
      </div>

      {activeHoldings.length === 0 ? (
        <div className="h-64 w-full flex flex-col items-center justify-center rounded-xl bg-surface-subtle p-6 text-center border border-dashed border-subtle">
          <PieChartIcon className="h-8 w-8 text-muted mb-2" />
          <p className="text-sm font-semibold text-main">Aucune position active</p>
          <p className="text-xs text-muted mt-1 max-w-xs">
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
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                      className="transition-all duration-200 cursor-pointer outline-none"
                      style={{
                        transform: activeIndex === index ? "scale(1.04)" : "scale(1)",
                        transformOrigin: "center center",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  isAnimationActive={false}
                  wrapperStyle={{ outline: "none", zIndex: 40 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl space-y-1.5 border border-slate-800 pointer-events-none min-w-[200px]">
                          <p className="font-bold text-sm text-sky-400 uppercase tracking-wide">{item.name}</p>
                          <p className="text-slate-200 text-xs font-medium max-w-[220px] truncate">{item.fullName}</p>
                          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800/80 mt-1.5">
                            <span className="text-slate-400 text-xs">Valeur:</span>
                            <span className="font-bold text-sm text-white">
                              {Number(item.value).toLocaleString("fr-FR")} €{" "}
                              <span className="text-sky-400 text-xs font-semibold">({Number(item.percent).toFixed(1)}%)</span>
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
            {/* Center Overlay: Active slice details on hover or Total when idle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4 transition-all duration-200">
              {activeItem ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
                  <span className="text-sm font-bold text-sky-500 dark:text-sky-400 uppercase truncate max-w-[120px]">
                    {activeItem.name}
                  </span>
                  <span className="text-xl font-bold text-main">
                    {activeItem.value.toLocaleString("fr-FR")} €
                  </span>
                  <span className="text-xs font-semibold text-muted">
                    {activeItem.percent.toFixed(1)}% du total
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-muted">Total</span>
                  <span className="text-lg font-bold text-main">
                    {totalValuation.toLocaleString("fr-FR")} €
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Allocation Legend List */}
          <div className="space-y-2.5 pt-2">
            {chartData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-3 w-3 rounded-full shrink-0 inline-block"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="font-bold text-main uppercase truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-muted font-medium">{item.value.toLocaleString("fr-FR")} €</span>
                  <span className="font-semibold text-main bg-surface-subtle border border-subtle px-2 py-0.5 rounded-full text-[11px]">
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
