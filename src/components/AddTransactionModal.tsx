"use client";

import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Array<{ _id: string; name: string; type: "PEA" | "CTO" }>;
}

export function AddTransactionModal({ isOpen, onClose, accounts }: AddTransactionModalProps) {
  const [type, setType] = useState<"ACHAT" | "VENTE" | "DIVIDENDE">("ACHAT");
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [assetType, setAssetType] = useState<"ETF" | "Action">("ETF");
  const [accountId, setAccountId] = useState(accounts[0]?._id || "");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [fees, setFees] = useState("0");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrCreateAsset = useMutation(api.assets.getOrCreateAsset);
  const addTransaction = useMutation(api.transactions.addTransaction);
  const updateSnapshotForMonth = useMutation(api.snapshots.updateSnapshotForMonth);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim() || !quantity || !unitPrice || !accountId) return;

    setLoading(true);
    setError(null);

    try {
      const assetId = await getOrCreateAsset({
        ticker: ticker.trim().toUpperCase(),
        name: name.trim() || ticker.trim().toUpperCase(),
        type: assetType,
        currentPrice: parseFloat(unitPrice),
      });

      await addTransaction({
        accountId: accountId as any,
        assetId,
        type,
        quantity: parseFloat(quantity),
        unitPrice: parseFloat(unitPrice),
        fees: parseFloat(fees || "0"),
        date,
      });

      await updateSnapshotForMonth({ yearMonth: date.substring(0, 7) });
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-lg font-bold text-white">Nouvelle Transaction</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
            {(["ACHAT", "VENTE", "DIVIDENDE"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                  type === t
                    ? t === "ACHAT"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : t === "VENTE"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Compte</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            >
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} ({acc.type})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Ticker (ex: CW8)</label>
              <input
                type="text"
                placeholder="CW8"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white uppercase focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Type d'Actif</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ETF">ETF</option>
                <option value="Action">Action</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nom complet</label>
            <input
              type="text"
              placeholder="Amundi MSCI World"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Quantité</label>
              <input
                type="number"
                step="any"
                placeholder="10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Prix (€)</label>
              <input
                type="number"
                step="any"
                placeholder="500"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Frais (€)</label>
              <input
                type="number"
                step="any"
                placeholder="0"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              {loading ? "Enregistrement..." : "Ajouter la transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
