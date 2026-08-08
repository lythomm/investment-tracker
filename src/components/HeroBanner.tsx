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
    <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-900 via-teal-800 to-sky-900 p-6 sm:p-10 shadow-xl border border-white/20 text-white">
      {/* Background Nature / Meadow Decorative Overlay */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* Left Side: Total Balance */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-200 font-serif-display tracking-wide">
            {selectedAccountName ? `Valeur — ${selectedAccountName}` : "Valeur du Portefeuille"}
          </span>

          <h1 className="text-4xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl font-sans">
            {summary.totalValuation.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </h1>
        </div>

        {/* Right Side Floating White Cards (Matching Finteco Reference UI) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:w-auto">
          {/* Card 1: Your Savings / Apports */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-md p-5 text-slate-900 shadow-lg w-full sm:w-56 border border-white/40">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
                <PiggyBank className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Ce mois-ci</span>
            </div>

            <div className="mt-4">
              <div className="text-xs font-serif-display text-slate-600">Apports Investis</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {summary.totalInvested.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </div>
            </div>
          </div>

          {/* Card 2: Your Investment / Plus-Value */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-md p-5 text-slate-900 shadow-lg w-full sm:w-56 border border-white/40">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Rendement</span>
            </div>

            <div className="mt-4">
              <div className="text-xs font-serif-display text-slate-600">Plus-Value Latente</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className={`text-2xl font-bold ${isPositive ? "text-slate-900" : "text-rose-600"}`}>
                  {isPositive ? "+" : ""}
                  {summary.totalGainAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </div>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-sky-600">
                {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                ROI {isPositive ? "+" : ""}{summary.totalGainPercent.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
