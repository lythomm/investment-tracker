"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trash2,
  History,
  Plus,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

type SortColumn = "date" | "ticker" | "type" | "quantity" | "unitPrice" | "total";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 50;

export function TransactionsList({ transactions }: TransactionsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTransaction = useMutation(api.transactions.deleteTransaction);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "ACHAT" | "VENTE" | "DIVIDENDE">("ALL");
  const [sortColumn, setSortColumn] = useState<SortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleSort = (col: SortColumn) => {
    setCurrentPage(1);
    if (sortColumn === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (typeFilter !== "ALL") {
      result = result.filter((t) => t.type === typeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((t) => {
        const ticker = (t.asset?.ticker || "").toLowerCase();
        const name = (t.asset?.name || "").toLowerCase();
        const account = (t.account?.name || "").toLowerCase();
        return ticker.includes(q) || name.includes(q) || account.includes(q);
      });
    }

    // Sort
    result.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortColumn === "date") {
        valA = a.date;
        valB = b.date;
      } else if (sortColumn === "ticker") {
        valA = a.asset?.ticker || "";
        valB = b.asset?.ticker || "";
      } else if (sortColumn === "type") {
        valA = a.type;
        valB = b.type;
      } else if (sortColumn === "quantity") {
        valA = a.quantity;
        valB = b.quantity;
      } else if (sortColumn === "unitPrice") {
        valA = a.unitPrice;
        valB = b.unitPrice;
      } else if (sortColumn === "total") {
        valA = a.quantity * a.unitPrice + a.fees;
        valB = b.quantity * b.unitPrice + b.fees;
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, searchQuery, typeFilter, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE) || 1;

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  // Compute total volume for filtered view
  const totalVolume = useMemo(() => {
    return filteredAndSortedTransactions.reduce(
      (sum, t) => sum + t.quantity * t.unitPrice + t.fees,
      0
    );
  }, [filteredAndSortedTransactions]);

  const renderSortIcon = (col: SortColumn) => {
    if (sortColumn !== col) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-slate-900" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-slate-900" />
    );
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
    <div className="card-light rounded-2xl p-6 sm:p-8 bg-white space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-normal text-slate-900 font-serif-display">
            Journal d'Historique
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {filteredAndSortedTransactions.length} transaction
            {filteredAndSortedTransactions.length > 1 ? "s" : ""} affichée
            {filteredAndSortedTransactions.length > 1 ? "s" : ""} • Total :{" "}
            <strong className="text-slate-900 font-bold">
              {totalVolume.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
            </strong>
          </p>
        </div>

        <Link href="/transactions/new" className="shrink-0">
          <Button variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
            Ajouter une transaction
          </Button>
        </Link>
      </div>

      {/* Dynamic Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par actif, nom ou compte..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-2xl bg-slate-100 pl-10 pr-9 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "ACHAT", "VENTE", "DIVIDENDE"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTypeFilter(t);
                setCurrentPage(1);
              }}
              className={`rounded-2xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                typeFilter === t
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t === "ALL" ? "Toutes" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      {filteredAndSortedTransactions.length === 0 ? (
        <div className="py-12 text-center text-slate-500 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
          <Filter className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="font-semibold text-sm text-slate-700">Aucun résultat ne correspond aux filtres</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setTypeFilter("ALL");
            }}
            className="mt-3 text-xs text-slate-900 underline font-bold cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-slate-500 font-semibold text-xs uppercase tracking-wide border-b border-slate-100">
                <th
                  onClick={() => handleSort("date")}
                  className="py-3 px-4 sm:px-6 cursor-pointer select-none group hover:text-slate-900"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Date</span>
                    {renderSortIcon("date")}
                  </div>
                </th>

                <th
                  onClick={() => handleSort("ticker")}
                  className="py-3 px-4 sm:px-6 cursor-pointer select-none group hover:text-slate-900"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Actif / Nom</span>
                    {renderSortIcon("ticker")}
                  </div>
                </th>

                <th className="py-3 px-4 sm:px-6">Compte</th>

                <th
                  onClick={() => handleSort("type")}
                  className="py-3 px-4 sm:px-6 cursor-pointer select-none group hover:text-slate-900"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Type</span>
                    {renderSortIcon("type")}
                  </div>
                </th>

                <th
                  onClick={() => handleSort("quantity")}
                  className="py-3 px-4 sm:px-6 text-right cursor-pointer select-none group hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Quantité</span>
                    {renderSortIcon("quantity")}
                  </div>
                </th>

                <th
                  onClick={() => handleSort("unitPrice")}
                  className="py-3 px-4 sm:px-6 text-right cursor-pointer select-none group hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Prix Unit.</span>
                    {renderSortIcon("unitPrice")}
                  </div>
                </th>

                <th className="py-3 px-4 sm:px-6 text-right">Frais</th>

                <th
                  onClick={() => handleSort("total")}
                  className="py-3 px-4 sm:px-6 text-right cursor-pointer select-none group hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total</span>
                    {renderSortIcon("total")}
                  </div>
                </th>

                <th className="py-3 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx) => {
                const total = tx.quantity * tx.unitPrice + tx.fees;
                const fullName = tx.asset?.name || tx.asset?.ticker || "";
                const mobileName =
                  fullName.length > 20 ? `${fullName.slice(0, 20)}...` : fullName;

                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50/80 transition border-b border-slate-50 last:border-0"
                  >
                    <td className="py-4 px-4 sm:px-6 font-medium text-sm text-slate-700">
                      {prettyDisplayDate(tx.date)}
                    </td>

                    <td className="py-4 px-4 sm:px-6 font-medium text-slate-900">
                      <div className="font-bold text-base text-slate-900 uppercase">
                        {tx.asset?.ticker || "—"}
                      </div>
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
                        className="rounded-2xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
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
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <div>
            Affichage de <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> à{" "}
            <span className="font-bold text-slate-900">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedTransactions.length)}
            </span>{" "}
            sur <span className="font-bold text-slate-900">{filteredAndSortedTransactions.length}</span> transactions
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Précédent</span>
            </button>

            <span className="px-3 py-1 font-bold text-slate-900">
              Page {currentPage} sur {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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
