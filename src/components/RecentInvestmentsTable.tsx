"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Layers, ArrowRight, Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { prettyDisplayDate } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTransaction = useMutation(api.transactions.deleteTransaction);

  const filtered = transactions.filter((t) => {
    if (filter === "ALL") return true;
    return t.type === filter;
  });

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteTransaction({ id: deleteId as any });
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card-light rounded-2xl p-6 sm:p-8">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-normal text-main font-serif-display">
          Derniers Investissements
        </h2>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(["ALL", "ACHAT", "VENTE", "DIVIDENDE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                filter === f
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-surface-subtle border border-subtle text-muted hover:text-main hover:bg-slate-200 dark:hover:bg-slate-800"
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
          <Layers className="h-10 w-10 text-muted mb-2" />
          <p className="text-base font-medium text-muted font-serif-display">Aucun enregistrement récent.</p>
          <Link href="/transactions/new" className="mt-4">
            <Button variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
              Ajouter une transaction
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-muted font-semibold text-xs uppercase tracking-wide border-b border-subtle">
                  <th className="py-3 px-4 sm:px-6">Nom / Ticker</th>
                  <th className="py-3 px-4 sm:px-6">Compte</th>
                  <th className="py-3 px-4 sm:px-6">Type</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Montant</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 6).map((tx) => {
                  const total = tx.quantity * tx.unitPrice + tx.fees;
                  const fullName = tx.asset?.name || tx.asset?.ticker || "";
                  const mobileName = fullName.length > 20 ? `${fullName.slice(0, 20)}...` : fullName;
                  return (
                    <tr key={tx._id} className="hover:bg-surface-hover transition border-b border-subtle last:border-0">
                      <td className="py-4 px-4 sm:px-6 font-medium text-main">
                        <div className="font-bold text-base text-main" title={fullName}>
                          <span className="sm:hidden">{mobileName}</span>
                          <span className="hidden sm:inline">{fullName}</span>
                        </div>
                        <div className="text-xs text-muted font-mono uppercase">{tx.asset?.ticker} • {prettyDisplayDate(tx.date)}</div>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-main font-medium">
                        {tx.account?.name || "Compte"}
                      </td>

                      <td className="py-4 px-4 sm:px-6 font-medium">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold ${
                            tx.type === "ACHAT"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                              : tx.type === "VENTE"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                          }`}
                        >
                          {tx.type} ({tx.quantity} u.)
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right font-bold text-base text-main">
                        {total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => setDeleteId(tx._id)}
                          className="rounded-2xl p-2 text-muted hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center">
            <Link href="/historique">
              <Button variant="primary" size="md">
                Voir plus <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Supprimer l'investissement"
        message="Êtes-vous sûr de vouloir supprimer cet investissement ? Cette action est irréversible."
      />
    </div>
  );
}
