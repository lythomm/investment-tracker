"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { HoldingsTable } from "@/components/HoldingsTable";
import { PortfolioAllocationCard } from "@/components/PortfolioAllocationCard";
import { AccountFilterPills } from "@/components/AccountFilterPills";
import { useModals } from "@/components/AppShell";
import { Plus, Wallet } from "lucide-react";

export default function PositionsPage() {
  const { openAddAccount, accounts } = useModals();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const queryArgs = selectedAccountId ? { accountId: selectedAccountId as any } : {};

  const portfolioSummary = useQuery(api.portfolio.getPortfolioSummary, queryArgs) || {
    totalInvested: 0,
    totalValuation: 0,
    totalGainAmount: 0,
    totalGainPercent: 0,
    totalDividends: 0,
    holdings: [],
  };

  return (
    <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 pt-4 space-y-6">
      {accounts.length === 0 ? (
        <div className="card-light flex flex-col items-center justify-center rounded-2xl p-16 text-center my-8 bg-white">
          <Wallet className="h-12 w-12 text-slate-800 mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 font-serif-display">Bienvenue sur Folio !</h2>
          <p className="mt-2 text-base text-slate-500 max-w-md">
            Créez votre premier compte PEA ou CTO pour démarrer votre suivi d'investissements.
          </p>
          <button
            onClick={openAddAccount}
            className="mt-6 flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-base font-bold text-white hover:bg-slate-800 transition"
          >
            <Plus className="h-5 w-5" /> Créer mon premier compte PEA / CTO
          </button>
        </div>
      ) : (
        <>
          <AccountFilterPills
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onSelectAccount={setSelectedAccountId}
            onOpenAddAccount={openAddAccount}
          />

          {/* Positions Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1">
              <PortfolioAllocationCard
                holdings={portfolioSummary.holdings}
                totalValuation={portfolioSummary.totalValuation}
              />
            </div>
            <div className="lg:col-span-2">
              <HoldingsTable holdings={portfolioSummary.holdings} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
