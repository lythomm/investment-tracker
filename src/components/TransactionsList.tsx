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
      <div className="card-light flex flex-col items-center justify-center rounded-[2.25rem] p-8 text-center bg-white border border-slate-100 shadow-sm">
        <History className="h-8 w-8 text-slate-300 mb-2" />
        <p className="text-xs text-slate-500 font-serif-display">Aucune transaction enregistrée dans le journal.</p>
      </div>
    );
  }

  return (
    <div className="card-light rounded-[2.25rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-normal text-slate-900 font-serif-display">
            Journal Complet des Transactions
          </h2>
          <p className="text-xs text-slate-500">Historique complet de vos ordres et dividendes</p>
        </div>
        <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
          {transactions.length} enregistrements
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto pr-1">
        <div className="space-y-2.5">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <span
                  className={
                    tx.type === "ACHAT"
                      ? "status-badge-complete"
                      : tx.type === "VENTE"
                      ? "status-badge-failed"
                      : "status-badge-pending"
                  }
                >
                  {tx.type}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{tx.asset?.ticker || "Actif"}</span>
                    <span className="text-[10px] text-slate-400">({tx.account?.name || "Compte"})</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {tx.date} • {tx.quantity} unit. @ {tx.unitPrice} € {tx.fees > 0 ? `(+${tx.fees}€ frais)` : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-sm text-slate-900">
                  {(tx.quantity * tx.unitPrice).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </span>
                <button
                  onClick={() => handleDelete(tx._id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
