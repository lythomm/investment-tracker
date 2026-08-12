"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Modal } from "./ui/Modal";

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
  const defaultDate = new Date().toISOString().substring(0, 10);

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

  // Sync rows accountId when accounts finish loading
  useEffect(() => {
    if (isOpen && accounts.length > 0) {
      setRows((prevRows) =>
        prevRows.map((r) =>
          !r.accountId || !accounts.some((a) => a._id === r.accountId)
            ? { ...r, accountId: accounts[0]._id }
            : r
        )
      );
    }
  }, [accounts, isOpen]);

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
        const targetAccountId = row.accountId || accounts[0]?._id;
        if (!row.ticker.trim() || !row.quantity || !row.unitPrice || !targetAccountId) {
          throw new Error("Veuillez remplir le ticker, le compte, la quantité et le prix pour chaque ligne.");
        }

        const assetId = await getOrCreateAsset({
          ticker: row.ticker.trim().toUpperCase(),
          name: row.name.trim() || row.ticker.trim().toUpperCase(),
          type: row.assetType,
          currentPrice: parseFloat(row.unitPrice),
        });

        itemsToSubmit.push({
          accountId: targetAccountId as any,
          assetId,
          type: "ACHAT" as const,
          quantity: parseFloat(row.quantity),
          unitPrice: parseFloat(row.unitPrice),
          fees: parseFloat(row.fees || "0"),
          date,
        });
      }

      await addBatchTransactions({ items: itemsToSubmit });

      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement du DCA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <Calendar className="h-6 w-6 text-slate-800" />
          <div>
            <h2 className="text-2xl font-normal text-slate-900 font-serif-display">
              Formulaire DCA du Mois
            </h2>
          </div>
        </div>
      }
      description="Enregistrez vos achats mensuels récurrents en 1 seule étape."
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Date Selection */}
        <div className="max-w-xs">
          <label className="mb-1 block text-xs font-semibold text-muted">
            Date du DCA
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input input-sm cursor-pointer"
            required
          />
        </div>

        {/* Batch Rows */}
        <div className="space-y-3">
          <div className="hidden grid-cols-12 gap-2 text-xs font-semibold text-muted sm:grid px-2">
            <span className="col-span-2">Ticker (ex: CW8)</span>
            <span className="col-span-3">Nom (ex: MSCI World)</span>
            <span className="col-span-2">Compte</span>
            <span className="col-span-2">Quantité</span>
            <span className="col-span-2">Prix unitaire (€)</span>
            <span className="col-span-1 text-right">Action</span>
          </div>

          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-1 gap-2 rounded-2xl bg-surface-subtle p-3 sm:grid-cols-12 sm:items-center sm:p-2 border border-subtle"
            >
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="CW8"
                  value={row.ticker}
                  onChange={(e) => handleUpdateRow(row.id, "ticker", e.target.value)}
                  className="input input-sm uppercase font-bold"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Amundi MSCI World"
                  value={row.name}
                  onChange={(e) => handleUpdateRow(row.id, "name", e.target.value)}
                  className="input input-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <select
                  value={row.accountId || accounts[0]?._id || ""}
                  onChange={(e) => handleUpdateRow(row.id, "accountId", e.target.value)}
                  className="input-select input-sm"
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
                <input
                  type="number"
                  step="any"
                  placeholder="1"
                  value={row.quantity}
                  onChange={(e) => handleUpdateRow(row.id, "quantity", e.target.value)}
                  className="input input-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <input
                  type="number"
                  step="any"
                  placeholder="500.00"
                  value={row.unitPrice}
                  onChange={(e) => handleUpdateRow(row.id, "unitPrice", e.target.value)}
                  className="input input-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-end sm:col-span-1 pr-1">
                <button
                  type="button"
                  onClick={() => handleRemoveRow(row.id)}
                  disabled={rows.length === 1}
                  className="rounded-2xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 transition"
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
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-700"
        >
          <Plus className="h-4 w-4" /> Ajouter une ligne d'achat
        </button>

        {/* Footer Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {loading ? "Enregistrement..." : "Valider le DCA du Mois"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
