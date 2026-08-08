"use client";

import { useState } from "react";
import { Trash2, Layers } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface RecentInvestmentsTableProps {
  transactions: Array<{
    _id: string;
    type: "ACHAT" | "VENTE" | "DIVIDENDE";
    quantity: number;
    unitPrice: number;
    fees: number;
    date: string;
    asset?: { ticker: string; name: string; type: string } | null;
    account?: { name: string; type: string } | null;
  }>;
}

export function RecentInvestmentsTable({ transactions }: RecentInvestmentsTableProps) {
  const [filter, setFilter] = useState<"ALL" | "ACHAT" | "VENTE" | "DIVIDENDE">("ALL");
  const deleteTransaction = useMutation(api.transactions.deleteTransaction);

  const filtered = transactions.filter((t) => {
    if (filter === "ALL") return true;
    return t.type === filter;
  });

  const handleDelete = async (id: any) => {
    if (confirm("Supprimer cet investissement ?")) {
      await deleteTransaction({ id });
    }
  };

  return (
    <div className="card-light rounded-[2.25rem] p-6 sm:p-8 bg-white border border-slate-200">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-normal text-slate-900 font-serif-display">
          Derniers Investissements
        </h2>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(["ALL", "ACHAT", "VENTE", "DIVIDENDE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium border transition ${
                filter === f
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f === "ALL" ? "Tous" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Layers className="h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-500 font-serif-display">Aucun enregistrement récent.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3 pl-2">Nom / Ticker</th>
                <th className="pb-3">Compte</th>
                <th className="pb-3">Type</th>
                <th className="pb-3 text-right">Montant</th>
                <th className="pb-3 text-center">Statut</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.slice(0, 10).map((tx) => {
                const total = tx.quantity * tx.unitPrice + tx.fees;
                return (
                  <tr key={tx._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 pl-2 font-medium text-slate-900">
                      <div className="font-semibold text-slate-900">{tx.asset?.name || tx.asset?.ticker}</div>
                      <div className="text-[11px] text-slate-400 font-mono uppercase">{tx.asset?.ticker} • {tx.date}</div>
                    </td>

                    <td className="py-4 text-slate-600 font-medium">
                      {tx.account?.name || "Compte"}
                    </td>

                    <td className="py-4 text-slate-600 font-medium">
                      {tx.type} ({tx.quantity} u.)
                    </td>

                    <td className="py-4 text-right font-semibold text-slate-900">
                      {total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </td>

                    <td className="py-4 text-center">
                      <span className={tx.type === "ACHAT" ? "status-badge-complete" : tx.type === "VENTE" ? "status-badge-failed" : "status-badge-pending"}>
                        Complete
                      </span>
                    </td>

                    <td className="py-4 text-right pr-2">
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
