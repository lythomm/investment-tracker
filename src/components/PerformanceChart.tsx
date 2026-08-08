"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface PerformanceChartProps {
  snapshots: Array<{
    yearMonth: string;
    totalInvested: number;
    totalValuation: number;
    totalGainAmount: number;
  }>;
}

export function PerformanceChart({ snapshots }: PerformanceChartProps) {
  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="glass-card flex h-72 flex-col items-center justify-center rounded-2xl p-6 text-center">
        <p className="text-sm font-medium text-slate-400">
          Aucun historique mensuel enregistré.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Utilisez le <strong className="text-emerald-400">Formulaire DCA du Mois</strong> pour générer vos premiers points sur 5 à 10 ans !
        </p>
      </div>
    );
  }

  const data = snapshots.map((s) => ({
    month: s.yearMonth,
    "Valeur Portefeuille": s.totalValuation,
    "Capital Investi": s.totalInvested,
  }));

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Évolution Long Terme (5 - 10 Ans)</h3>
          <p className="text-xs text-slate-400">
            Comparaison entre la valeur actuelle et les apports nets investis
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Valeur Portefeuille</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
            <span className="text-slate-400">Capital Investi</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValuation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#fff",
              }}
              formatter={(value: any) => [`${Number(value).toLocaleString("fr-FR")} €`]}
            />
            <Area
              type="monotone"
              dataKey="Valeur Portefeuille"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorValuation)"
            />
            <Area
              type="monotone"
              dataKey="Capital Investi"
              stroke="#0d9488"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorInvested)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
