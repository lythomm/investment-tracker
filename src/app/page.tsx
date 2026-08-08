"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { MetricsOverview } from "@/components/MetricsOverview";
import { PerformanceChart } from "@/components/PerformanceChart";
import { HoldingsTable } from "@/components/HoldingsTable";
import { TransactionsList } from "@/components/TransactionsList";
import { DcaBatchModal } from "@/components/DcaBatchModal";
import { CsvImportModal } from "@/components/CsvImportModal";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { AddAccountModal } from "@/components/AddAccountModal";
import { AuthScreen } from "@/components/AuthScreen";
import { Loader2, Plus, Wallet } from "lucide-react";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Modals state
  const [isDcaOpen, setIsDcaOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  // Convex Queries
  const accounts = useQuery(api.accounts.getAccounts) || [];
  const portfolioSummary = useQuery(
    api.portfolio.getPortfolioSummary,
    isAuthenticated ? { accountId: selectedAccountId as any } : "skip"
  ) || {
    totalInvested: 0,
    totalValuation: 0,
    totalGainAmount: 0,
    totalGainPercent: 0,
    totalDividends: 0,
    holdings: [],
  };
  const snapshots = useQuery(
    api.snapshots.getMonthlySnapshots,
    isAuthenticated ? {} : "skip"
  ) || [];
  const transactions = useQuery(
    api.transactions.getTransactions,
    isAuthenticated ? { accountId: selectedAccountId as any } : "skip"
  ) || [];

  const createAccount = useMutation(api.accounts.createAccount);

  useEffect(() => {
    if (isAuthenticated && accounts && accounts.length === 0) {
      createAccount({ name: "PEA Principal", type: "PEA" });
    }
  }, [isAuthenticated, accounts]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-emerald-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        onOpenDca={() => setIsDcaOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenAddTx={() => setIsAddTxOpen(true)}
        onOpenAddAccount={() => setIsAddAccountOpen(true)}
        onSignOut={() => signOut()}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
        accounts={accounts}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {accounts.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center rounded-3xl p-12 text-center">
            <Wallet className="h-12 w-12 text-emerald-400 mb-3" />
            <h2 className="text-xl font-bold text-white">Bienvenue sur Folio !</h2>
            <p className="mt-1 text-sm text-slate-400 max-w-md">
              Pour commencer votre suivi d'investissements, créez votre premier compte PEA ou CTO.
            </p>
            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="h-4 w-4" /> Créer mon premier compte
            </button>
          </div>
        ) : (
          <>
            <MetricsOverview summary={portfolioSummary} />
            <PerformanceChart snapshots={snapshots} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <HoldingsTable holdings={portfolioSummary.holdings} />
              </div>
              <div className="lg:col-span-1">
                <TransactionsList transactions={transactions as any} />
              </div>
            </div>
          </>
        )}
      </main>

      <DcaBatchModal
        isOpen={isDcaOpen}
        onClose={() => setIsDcaOpen(false)}
        accounts={accounts}
      />
      <CsvImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        accounts={accounts}
      />
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
