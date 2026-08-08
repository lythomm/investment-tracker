"use client";

import { Trash2, History } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface TransactionsListProps {
  transactions: Array<{
    _id: string;
    type: "ACHAT" | "VENTE" | "DIVIDENDE";
    quantity: number;
    unitPrice: number;
    fees: number;
    date: string;
    asset?: { ticker: string; name: string } | null;
    account?: { name: string; type: string } | null;
  }>;
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const deleteTransaction = useMutation(api.transactions.deleteTransaction);

  const handleDelete = async (id: any) => {
    if (confirm("Supprimer cette transaction ?")) {
      await deleteTransaction({ id });
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-6 text-center">
        <History className="h-8 w-8 text-slate-600 mb-2" />
        <p className="text-xs text-slate-400">Aucune transaction enregistrée dans le journal.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Journal des Transactions</h3>
          <p className="text-xs text-slate-400">Historique complet de vos ordres et dividendes</p>
        </div>
        <span className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-400">
          {transactions.length} enregistrements
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto pr-1">
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                    tx.type === "ACHAT"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : tx.type === "VENTE"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {tx.type}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{tx.asset?.ticker || "Actif"}</span>
                    <span className="text-[10px] text-slate-400">({tx.account?.name || "Compte"})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {tx.date} • {tx.quantity} unit. @ {tx.unitPrice} € {tx.fees > 0 ? `(+${tx.fees}€ frais)` : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-xs text-slate-200">
                  {(tx.quantity * tx.unitPrice).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </span>
                <button
                  onClick={() => handleDelete(tx._id)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition"
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
