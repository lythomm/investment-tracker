"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { TransactionsList } from "@/components/TransactionsList";
import { AccountFilterPills } from "@/components/AccountFilterPills";
import { useModals } from "@/components/AppShell";
import { Plus, Wallet } from "lucide-react";

export default function HistoriquePage() {
  const { openAddAccount, accounts } = useModals();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const queryArgs = selectedAccountId ? { accountId: selectedAccountId as any } : {};

  const transactions = useQuery(api.transactions.getTransactions, queryArgs) || [];

  return (
    <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 pt-4 space-y-6">
      {accounts.length === 0 ? (
        <div className="card flex flex-col items-center justify-center rounded-2xl p-16 text-center my-8">
          <Wallet className="h-12 w-12 text-main mb-4" />
          <h2 className="text-3xl font-bold text-main font-serif-display">Bienvenue sur Folio !</h2>
          <p className="mt-2 text-base text-muted max-w-md">
            Créez votre premier compte PEA ou CTO pour démarrer votre suivi d'investissements.
          </p>
          <button
            onClick={openAddAccount}
            className="mt-6 flex items-center gap-2 rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-6 py-3 text-base font-bold hover:bg-slate-800 dark:hover:bg-white transition"
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
            onOpenAddAccount={openOpenAddAccount(openAddAccount)}
          />

          <TransactionsList transactions={transactions as any} />
        </>
      )}
    </main>
  );
}

function openOpenAddAccount(openAddAccount: () => void) {
  return openAddAccount;
}
