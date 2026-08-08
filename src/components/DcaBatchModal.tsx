"use client";

import { useState } from "react";
import { X, Plus, Trash2, Calendar, CheckCircle2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface DcaBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Array<{ _id: string; name: string; type: "PEA" | "CTO" }>;
}

interface DcaRow {
  id: string;
  ticker: string;
  name: string;
  assetType: "ETF" | "Action";
  accountId: string;
  quantity: string;
  unitPrice: string;
  fees: string;
}

export function DcaBatchModal({ isOpen, onClose, accounts }: DcaBatchModalProps) {
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const defaultDate = new Date().toISOString().substring(0, 10); // YYYY-MM-DD

  const [date, setDate] = useState(defaultDate);
  const [rows, setRows] = useState<DcaRow[]>([
    {
      id: "1",
      ticker: "CW8",
      name: "Amundi MSCI World",
      assetType: "ETF",
      accountId: accounts[0]?._id || "",
      quantity: "",
      unitPrice: "",
      fees: "0",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrCreateAsset = useMutation(api.assets.getOrCreateAsset);
  const addBatchTransactions = useMutation(api.transactions.addBatchTransactions);
  const updateSnapshotForMonth = useMutation(api.snapshots.updateSnapshotForMonth);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Math.random().toString(),
        ticker: "",
        name: "",
        assetType: "ETF",
        accountId: accounts[0]?._id || "",
        quantity: "",
        unitPrice: "",
        fees: "0",
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length === 1) return;
    setRows(rows.filter((r) => r.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof DcaRow, value: string) => {
    setRows(
      rows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const itemsToSubmit = [];

      for (const row of rows) {
        if (!row.ticker.trim() || !row.quantity || !row.unitPrice || !row.accountId) {
          throw new Error("Veuillez remplir le ticker, le compte, la quantité et le prix pour chaque ligne.");
        }

        const assetId = await getOrCreateAsset({
          ticker: row.ticker.trim().toUpperCase(),
          name: row.name.trim() || row.ticker.trim().toUpperCase(),
          type: row.assetType,
          currentPrice: parseFloat(row.unitPrice),
        });

        itemsToSubmit.push({
          accountId: row.accountId as any,
          assetId,
          type: "ACHAT" as const,
          quantity: parseFloat(row.quantity),
          unitPrice: parseFloat(row.unitPrice),
          fees: parseFloat(row.fees || "0"),
          date,
        });
      }

      await addBatchTransactions({ items: itemsToSubmit });

      // Trigger monthly snapshot recalculation
      const yearMonth = date.substring(0, 7);
      await updateSnapshotForMonth({ yearMonth });

      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement du DCA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Formulaire DCA du Mois</h2>
              <p className="text-xs text-slate-400">
                Enregistrez vos achats mensuels récurrents en 1 seule étape.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between">
          <div className="space-y-6">
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Date Selection */}
            <div className="max-w-xs">
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Date du DCA
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            {/* Batch Rows */}
            <div className="space-y-3">
              <div className="hidden grid-cols-12 gap-2 text-xs font-semibold text-slate-400 sm:grid">
                <span className="col-span-2">Ticker (ex: CW8)</span>
                <span className="col-span-3">Nom (ex: MSCI World)</span>
                <span className="col-span-2">Compte</span>
                <span className="col-span-2">Quantité</span>
                <span className="col-span-2">Prix unitaire (€)</span>
                <span className="col-span-1 text-right">Action</span>
              </div>

              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:grid-cols-12 sm:items-center sm:p-2"
                >
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 sm:hidden">Ticker</label>
                    <input
                      type="text"
                      placeholder="CW8"
                      value={row.ticker}
                      onChange={(e) => handleUpdateRow(row.id, "ticker", e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white uppercase focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-slate-400 sm:hidden">Nom complet</label>
                    <input
                      type="text"
                      placeholder="Amundi MSCI World"
                      value={row.name}
                      onChange={(e) => handleUpdateRow(row.id, "name", e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 sm:hidden">Compte</label>
                    <select
                      value={row.accountId}
                      onChange={(e) => handleUpdateRow(row.id, "accountId", e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      required
                    >
                      {accounts.map((acc) => (
                        <option key={acc._id} value={acc._id}>
                          {acc.name} ({acc.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 sm:hidden">Quantité</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="1"
                      value={row.quantity}
                      onChange={(e) => handleUpdateRow(row.id, "quantity", e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 sm:hidden">Prix Unit. (€)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="500.00"
                      value={row.unitPrice}
                      onChange={(e) => handleUpdateRow(row.id, "unitPrice", e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end sm:col-span-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      disabled={rows.length === 1}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <Plus className="h-4 w-4" /> Ajouter une ligne d'achat
            </button>
          </div>

          {/* Footer Submit */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              {loading ? "Enregistrement..." : "Valider le DCA du Mois"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
