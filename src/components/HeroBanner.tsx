"use client";

import { Wallet, TrendingUp, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface HeroBannerProps {
  summary: {
    totalInvested: number;
    totalValuation: number;
    totalGainAmount: number;
    totalGainPercent: number;
    totalDividends: number;
  };
  selectedAccountName?: string | null;
}

export function HeroBanner({ summary, selectedAccountName }: HeroBannerProps) {
  const isPositive = summary.totalGainAmount >= 0;

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border border-slate-800/80 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl">
      {/* Background Subtle Scenic Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.1),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* Left Big Balance Display */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {selectedAccountName ? `Valeur — ${selectedAccountName}` : "Valeur Totale du Portefeuille"}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {summary.totalValuation.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
            </h1>
          </div>

          <p className="text-xs text-slate-400 max-w-sm">
            Mise à jour en temps réel selon les derniers cours du marché.
          </p>
        </div>

        {/* Right Floating Quick Metric Cards (Inspired by reference UI cards) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
          {/* Card 1: Apports Investis */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between w-full sm:w-56 border border-slate-700/50 bg-slate-900/80 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <PiggyBank className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Mensuel / Total
              </span>
            </div>

            <div className="mt-4">
              <div className="text-xs font-medium text-slate-400">Apports Investis</div>
              <div className="text-xl font-bold text-white mt-0.5">
                {summary.totalInvested.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </div>
            </div>
          </div>

          {/* Card 2: Plus-Value Latente */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between w-full sm:w-56 border border-slate-700/50 bg-slate-900/80 shadow-xl">
            <div className="flex items-center justify-between">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                  isPositive
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                }`}
              >
                <TrendingUp className="h-5 w-5" />
              </div>
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {isPositive ? "+" : ""}
                {summary.totalGainPercent.toFixed(2)}%
              </span>
            </div>

            <div className="mt-4">
              <div className="text-xs font-medium text-slate-400">Plus-Value Latente</div>
              <div className={`text-xl font-bold mt-0.5 ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                {isPositive ? "+" : ""}
                {summary.totalGainAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
