"use client";

import { useState, useEffect } from "react";
import { TrendingUp, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import NumberFlow from "@number-flow/react";

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const isPositive = summary.totalGainAmount >= 0;

  const valuation = isLoaded ? summary.totalValuation : 0;
  const invested = isLoaded ? summary.totalInvested : 0;
  const gainAmount = isLoaded ? summary.totalGainAmount : 0;
  const gainPercent = isLoaded ? summary.totalGainPercent : 0;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl p-8 text-white min-h-[25rem] flex flex-col justify-end">
      {/* Generated Meadow Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('/hero_meadow_bg.png')`,
        }}
      />
      {/* Soft Scrim Gradient Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-800/10 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* Left Side: Total Balance */}
        <div className="space-y-1">
          <span className="text-xl font-normal text-white font-serif-display tracking-wide">
            {selectedAccountName ? `Valeur — ${selectedAccountName}` : "Solde Total"}
          </span>

          <h1 className="text-5xl font-normal tracking-tight text-white sm:text-6xl lg:text-7xl font-sans">
            <NumberFlow
              value={valuation}
              locales="fr-FR"
              format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              suffix=" €"
            />
          </h1>
        </div>

        {/* Right Side Floating White/Dark Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:w-auto">
          {/* Card 1: Your Savings */}
          <div className="rounded-2xl bg-surface/90 border border-subtle/50 backdrop-blur-md p-6 text-main w-full sm:w-64">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white">
                <PiggyBank className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-muted">Ce mois-ci</span>
            </div>

            <div className="mt-4">
              <div className="text-sm font-serif-display text-muted">Apports Investis</div>
              <div className="text-3xl font-bold text-main mt-1">
                <NumberFlow
                  value={invested}
                  locales="fr-FR"
                  format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                  suffix=" €"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Your Investment */}
          <div className="rounded-2xl bg-surface/90 border border-subtle/50 backdrop-blur-md p-6 text-main w-full sm:w-64">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-muted">Rendement</span>
            </div>

            <div className="mt-4">
              <div className="text-sm font-serif-display text-muted">Plus-Value Latente</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className={`text-3xl font-bold ${isPositive ? "text-main" : "text-rose-600 dark:text-rose-400"}`}>
                  <NumberFlow
                    value={gainAmount}
                    locales="fr-FR"
                    format={{ minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: isPositive ? "always" : "auto" }}
                    suffix=" €"
                  />
                </div>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-sm font-semibold text-sky-500">
                {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                ROI{" "}
                <NumberFlow
                  value={gainPercent}
                  locales="fr-FR"
                  format={{ minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: isPositive ? "always" : "auto" }}
                  suffix="%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
