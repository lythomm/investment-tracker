"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { RecentInvestmentsTable } from "@/components/RecentInvestmentsTable";
import { FinancialPerformanceCard } from "@/components/FinancialPerformanceCard";
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

  const [activeTab, setActiveTab] = useState<"dashboard" | "transactions" | "holdings">("dashboard");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Modals state
  const [isDcaOpen, setIsDcaOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  const queryArgs = selectedAccountId ? { accountId: selectedAccountId as any } : {};

  // Convex Queries
  const accounts = useQuery(api.accounts.getAccounts) || [];
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
  const snapshots = useQuery(
    api.snapshots.getMonthlySnapshots,
    isAuthenticated ? {} : "skip"
  ) || [];
  const transactions = useQuery(
    api.transactions.getTransactions,
    isAuthenticated ? queryArgs : "skip"
  ) || [];

  const createAccount = useMutation(api.accounts.createAccount);

  useEffect(() => {
    if (isAuthenticated && accounts && accounts.length === 0) {
      createAccount({ name: "PEA Principal", type: "PEA" });
    }
  }, [isAuthenticated, accounts]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16] text-emerald-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const selectedAccount = accounts.find((a: any) => a._id === selectedAccountId);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans pb-10">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDca={() => setIsDcaOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenAddTx={() => setIsAddTxOpen(true)}
        onOpenAddAccount={() => setIsAddAccountOpen(true)}
        onSignOut={() => signOut()}
        accounts={accounts}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 pt-4 space-y-6">
        {accounts.length === 0 ? (
          <div className="card-fintech flex flex-col items-center justify-center rounded-3xl p-16 text-center my-12">
            <Wallet className="h-12 w-12 text-emerald-400 mb-4" />
            <h2 className="text-2xl font-bold text-white">Bienvenue sur Folio !</h2>
            <p className="mt-2 text-sm text-slate-400 max-w-md">
              Pour démarrer votre suivi d'investissements dépouillé et sobre, créez votre premier compte.
            </p>
            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="mt-6 flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 transition"
            >
              <Plus className="h-4 w-4" /> Créer mon premier compte PEA / CTO
            </button>
          </div>
        ) : (
          <>
            {/* Top Hero Banner */}
            <HeroBanner
              summary={portfolioSummary}
              selectedAccountName={selectedAccount ? `${selectedAccount.name} (${selectedAccount.type})` : null}
            />

            {/* Account Selector Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <button
                onClick={() => setSelectedAccountId(null)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedAccountId === null
                    ? "bg-white text-slate-950 shadow"
                    : "border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white"
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
                      ? "bg-white text-slate-950 shadow"
                      : "border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white"
                  }`}
                >
                  {acc.name} ({acc.type})
                </button>
              ))}
              <button
                onClick={() => setIsAddAccountOpen(true)}
                className="flex items-center gap-1 rounded-full border border-dashed border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" /> Nouveau Compte
              </button>
            </div>

            {/* Dashboard View */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                  <RecentInvestmentsTable transactions={transactions as any} />
                </div>
                <div className="lg:col-span-1">
                  <FinancialPerformanceCard snapshots={snapshots} summary={portfolioSummary} />
                </div>
              </div>
            )}

            {/* Holdings Positions View */}
            {activeTab === "holdings" && (
              <HoldingsTable holdings={portfolioSummary.holdings} />
            )}

            {/* Full Transactions History View */}
            {activeTab === "transactions" && (
              <TransactionsList transactions={transactions as any} />
            )}
          </>
        )}
      </main>

      {/* Modals */}
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
