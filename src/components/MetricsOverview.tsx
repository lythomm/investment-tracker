"use client";

import { DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Gift } from "lucide-react";

interface MetricsOverviewProps {
  summary: {
    totalInvested: number;
    totalValuation: number;
    totalGainAmount: number;
    totalGainPercent: number;
    totalDividends: number;
  };
}

export function MetricsOverview({ summary }: MetricsOverviewProps) {
  const isPositive = summary.totalGainAmount >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Valuation */}
      <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Valeur du Portefeuille
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {summary.totalValuation.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          Valeur actuelle estimée des positions
        </div>
      </div>

      {/* Total Invested */}
      <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Apports Investis
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {summary.totalInvested.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          Capital total injecté dans les actifs
        </div>
      </div>

      {/* Plus-Value Latente */}
      <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Plus-Value Latente
          </span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold tracking-tight sm:text-3xl ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {summary.totalGainAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}
          >
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(summary.totalGainPercent).toFixed(2)} %
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          Gain/perte théorique non réalisé
        </div>
      </div>

      {/* Dividendes Perçus */}
      <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Dividendes Cumulés
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Gift className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold tracking-tight text-amber-300 sm:text-3xl">
            {summary.totalDividends.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          Revenus passifs totaux perçus
        </div>
      </div>
    </div>
  );
}
