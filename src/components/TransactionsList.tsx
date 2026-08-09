"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, History, Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { prettyDisplayDate } from "@/lib/formatters";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/Button";

interface TransactionsListProps {
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

export function TransactionsList({ transactions }: TransactionsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTransaction = useMutation(api.transactions.deleteTransaction);

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

  if (transactions.length === 0) {
    return (
      <div className="card-light flex flex-col items-center justify-center rounded-2xl p-16 text-center bg-white">
        <History className="h-12 w-12 text-slate-300 mb-3" />
        <p className="text-lg font-medium text-slate-600 font-serif-display">
          Aucune transaction enregistrée dans le journal.
        </p>
        <Link href="/transactions/new" className="mt-4">
          <Button variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
            Ajouter une transaction
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="card-light rounded-2xl p-6 sm:p-8 bg-white">
      <div className="mb-6">
        <h2 className="text-3xl font-normal text-slate-900 font-serif-display">
          Journal d'Historique
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Historique complet de toutes vos opérations enregistrées.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="text-slate-500 font-semibold text-xs uppercase tracking-wide border-b border-slate-100">
              <th className="py-3 px-4 sm:px-6">Date</th>
              <th className="py-3 px-4 sm:px-6">Actif / Nom</th>
              <th className="py-3 px-4 sm:px-6">Compte</th>
              <th className="py-3 px-4 sm:px-6">Type</th>
              <th className="py-3 px-4 sm:px-6 text-right">Quantité</th>
              <th className="py-3 px-4 sm:px-6 text-right">Prix Unit.</th>
              <th className="py-3 px-4 sm:px-6 text-right">Frais</th>
              <th className="py-3 px-4 sm:px-6 text-right">Total</th>
              <th className="py-3 px-4 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const total = tx.quantity * tx.unitPrice + tx.fees;
              const fullName = tx.asset?.name || tx.asset?.ticker || "";
              const mobileName = fullName.length > 20 ? `${fullName.slice(0, 20)}...` : fullName;
              return (
                <tr key={tx._id} className="hover:bg-slate-50/80 transition border-b border-slate-50 last:border-0">
                  <td className="py-4 px-4 sm:px-6 font-medium text-sm text-slate-700">
                    {prettyDisplayDate(tx.date)}
                  </td>

                  <td className="py-4 px-4 sm:px-6 font-medium text-slate-900">
                    <div className="font-bold text-base text-slate-900 uppercase">{tx.asset?.ticker || "—"}</div>
                    {tx.asset?.name && (
                      <div className="text-xs text-slate-500" title={fullName}>
                        <span className="sm:hidden">{mobileName}</span>
                        <span className="hidden sm:inline">{fullName}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-slate-700 font-medium">
                    {tx.account?.name || "Compte"}
                  </td>

                  <td className="py-4 px-4 sm:px-6">
                    <span
                      className={`rounded-2xl px-3 py-1 text-xs font-semibold ${
                        tx.type === "ACHAT"
                          ? "bg-emerald-100 text-emerald-800"
                          : tx.type === "VENTE"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right font-medium text-slate-900">
                    {tx.quantity}
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right text-slate-700">
                    {tx.unitPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right text-slate-500">
                    {tx.fees.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right font-bold text-base text-slate-900">
                    {total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      onClick={() => setDeleteId(tx._id)}
                      className="rounded-2xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
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

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Supprimer la transaction"
        message="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
      />
    </div>
  );
}
