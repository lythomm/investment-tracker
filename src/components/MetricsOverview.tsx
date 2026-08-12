"use client";

import { DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Gift } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface MetricsOverviewProps {
  summary: {
    totalInvested: number;
    totalValuation: number;
    totalGainAmount: number;
    totalGainPercent: number;
    totalDividends: number;
  };
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
};

export function MetricsOverview({ summary }: MetricsOverviewProps) {
  const isPositive = summary.totalGainAmount >= 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {/* Total Valuation */}
      <motion.div variants={itemVariants} className="card card-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Valeur du Portefeuille
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold tracking-tight text-main sm:text-3xl">
            {summary.totalValuation.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="mt-2 text-[11px] text-muted">
          Valeur actuelle estimée des positions
        </div>
      </motion.div>

      {/* Total Invested */}
      <motion.div variants={itemVariants} className="card card-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Total Apports Investis
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold tracking-tight text-main sm:text-3xl">
            {summary.totalInvested.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="mt-2 text-[11px] text-muted">
          Capital total injecté dans les actifs
        </div>
      </motion.div>

      {/* Plus-Value Latente */}
      <motion.div variants={itemVariants} className="card card-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Plus-Value Latente
          </span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold tracking-tight sm:text-3xl ${
              isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {summary.totalGainAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30"
            }`}
          >
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(summary.totalGainPercent).toFixed(2)} %
          </span>
        </div>
        <div className="mt-2 text-[11px] text-muted">
          Gain/perte théorique non réalisé
        </div>
      </motion.div>

      {/* Dividendes Cumulés */}
      <motion.div variants={itemVariants} className="card card-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Dividendes Cumulés
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Gift className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 sm:text-3xl">
            {summary.totalDividends.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="mt-2 text-[11px] text-muted">
          Revenus passifs totaux perçus
        </div>
      </motion.div>
    </motion.div>
  );
}
