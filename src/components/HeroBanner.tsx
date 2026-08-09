"use client";

import { TrendingUp, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
    <div className="relative w-full overflow-hidden rounded-2xl p-8 sm:p-14 lg:p-16 text-white min-h-[330px] flex flex-col justify-end">
      {/* Generated Meadow Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('/hero_meadow_bg.png')`,
        }}
      />
      {/* Soft Scrim Gradient Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/30 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* Left Side: Total Balance */}
        <div className="space-y-1">
          <span className="text-xl font-normal text-white font-serif-display tracking-wide">
            {selectedAccountName ? `Valeur — ${selectedAccountName}` : "Total Balance"}
          </span>

          <h1 className="text-5xl font-normal tracking-tight text-white sm:text-6xl lg:text-7xl font-sans">
            {summary.totalValuation.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </h1>
        </div>

        {/* Right Side Floating White Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:w-auto">
          {/* Card 1: Your Savings */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-md p-6 text-slate-900 w-full sm:w-64">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white">
                <PiggyBank className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-400">Ce mois-ci</span>
            </div>

            <div className="mt-4">
              <div className="text-sm font-serif-display text-slate-600">Apports Investis</div>
              <div className="text-3xl font-bold text-slate-900 mt-1">
                {summary.totalInvested.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </div>
            </div>
          </div>

          {/* Card 2: Your Investment */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-md p-6 text-slate-900 w-full sm:w-64">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-400">Rendement</span>
            </div>

            <div className="mt-4">
              <div className="text-sm font-serif-display text-slate-600">Plus-Value Latente</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className={`text-3xl font-bold ${isPositive ? "text-slate-900" : "text-rose-600"}`}>
                  {isPositive ? "+" : ""}
                  {summary.totalGainAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </div>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-sm font-semibold text-sky-600">
                {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                ROI {isPositive ? "+" : ""}{summary.totalGainPercent.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
