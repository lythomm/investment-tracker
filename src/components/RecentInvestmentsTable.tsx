"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Trash2, Layers } from "lucide-react";
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
    if (confirm("Supprimer cet investissement du journal ?")) {
      await deleteTransaction({ id });
    }
  };

  return (
    <div className="card-fintech rounded-3xl p-6 shadow-xl border border-slate-800/80 bg-slate-900/70">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Derniers Investissements</h2>
          <p className="text-xs text-slate-400">Activités et ordres enregistrés récemment</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 p-1 self-start sm:self-auto">
          {(["ALL", "ACHAT", "VENTE", "DIVIDENDE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                filter === f
                  ? "bg-white text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {f === "ALL" ? "Tous" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Layers className="h-10 w-10 text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-400">Aucun investissement dans cette vue.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Actif</th>
                <th className="pb-3">Compte</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Quantité</th>
                <th className="pb-3 text-right">Prix Unit.</th>
                <th className="pb-3 text-right">Total Investi</th>
                <th className="pb-3 text-center">Statut</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.slice(0, 10).map((tx) => {
                const total = tx.quantity * tx.unitPrice + tx.fees;
                return (
                  <tr key={tx._id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 font-bold">
                          {tx.asset?.ticker?.substring(0, 2) || "EQ"}
                        </div>
                        <div>
                          <div className="font-bold text-white uppercase">{tx.asset?.ticker || "Actif"}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {tx.asset?.name || "Titre"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-300">
                        {tx.account?.name || "Compte"} ({tx.account?.type})
                      </span>
                    </td>

                    <td className="py-3.5 text-slate-300 font-medium">{tx.date}</td>

                    <td className="py-3.5 text-right font-medium text-white">
                      {tx.quantity} unit.
                    </td>

                    <td className="py-3.5 text-right text-slate-300">
                      {tx.unitPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </td>

                    <td className="py-3.5 text-right font-bold text-white">
                      {total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </td>

                    <td className="py-3.5 text-center">
                      <span className={tx.type === "ACHAT" ? "status-pill-success" : "status-pill-info"}>
                        Complete
                      </span>
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition"
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
