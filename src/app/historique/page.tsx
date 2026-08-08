"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { TransactionsList } from "@/components/TransactionsList";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { AddAccountModal } from "@/components/AddAccountModal";
import { AuthScreen } from "@/components/AuthScreen";
import { Loader2, Plus, Wallet } from "lucide-react";

export default function HistoriquePage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  const queryArgs = selectedAccountId ? { accountId: selectedAccountId as any } : {};

  const rawAccounts = useQuery(api.accounts.getAccounts, isAuthenticated ? {} : "skip");
  const accounts = rawAccounts || [];

  const portfolioSummary = useQuery(
    api.portfolio.getPortfolioSummary,
    isAuthenticated ? queryArgs : "skip"
  ) || {
    totalInvested: 0,
    totalValuation: 0,
    totalGainAmount: 0,
    totalGainPercent: 0,
    totalDividends: 0,
    holdings: [],
  };

  const transactions = useQuery(
    api.transactions.getTransactions,
    isAuthenticated ? queryArgs : "skip"
  ) || [];

  if (isLoading || (isAuthenticated && rawAccounts === undefined)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const selectedAccount = accounts.find((a: any) => a._id === selectedAccountId);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col pb-12">
      <Navbar
        onOpenAddTx={() => setIsAddTxOpen(true)}
        onSignOut={() => signOut()}
      />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 pt-6 space-y-6">
        {accounts.length === 0 ? (
          <div className="card-light flex flex-col items-center justify-center rounded-3xl p-16 text-center my-8 bg-white border border-slate-200">
            <Wallet className="h-12 w-12 text-slate-800 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 font-serif-display">Bienvenue sur Folio !</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              Créez votre premier compte PEA ou CTO pour démarrer votre suivi d'investissements.
            </p>
            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="mt-6 flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
            >
              <Plus className="h-4 w-4" /> Créer mon premier compte PEA / CTO
            </button>
          </div>
        ) : (
          <>
            <HeroBanner
              summary={portfolioSummary}
              selectedAccountName={selectedAccount ? `${selectedAccount.name} (${selectedAccount.type})` : null}
            />

            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <button
                onClick={() => setSelectedAccountId(null)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedAccountId === null
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                Tous les comptes
              </button>
              {accounts.map((acc: any) => (
                <button
                  key={acc._id}
                  onClick={() => setSelectedAccountId(acc._id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    selectedAccountId === acc._id
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {acc.name} ({acc.type})
                </button>
              ))}
              <button
                onClick={() => setIsAddAccountOpen(true)}
                className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" /> Nouveau Compte
              </button>
            </div>

            <TransactionsList transactions={transactions as any} />
          </>
        )}
      </main>

      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        accounts={accounts}
      />
      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
      />
    </div>
  );
}
