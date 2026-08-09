"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Modal } from "./ui/Modal";

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
  const [accountId, setAccountId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [fees, setFees] = useState("0");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrCreateAsset = useMutation(api.assets.getOrCreateAsset);
  const addTransaction = useMutation(api.transactions.addTransaction);
  const updateSnapshotForMonth = useMutation(api.snapshots.updateSnapshotForMonth);

  // Sync accountId when accounts finish loading or modal opens
  useEffect(() => {
    if (isOpen && accounts.length > 0) {
      if (!accountId || !accounts.some((a) => a._id === accountId)) {
        setAccountId(accounts[0]._id);
      }
    }
  }, [accounts, isOpen, accountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetAccountId = accountId || accounts[0]?._id;

    if (!ticker.trim()) {
      setError("Veuillez renseigner le Ticker.");
      return;
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      setError("Veuillez renseigner une quantité valide.");
      return;
    }
    if (!unitPrice || parseFloat(unitPrice) <= 0) {
      setError("Veuillez renseigner un prix unitaire valide.");
      return;
    }
    if (!targetAccountId) {
      setError("Veuillez créer un compte (PEA / CTO) avant d'ajouter une transaction.");
      return;
    }

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
        accountId: targetAccountId as any,
        assetId,
        type,
        quantity: parseFloat(quantity),
        unitPrice: parseFloat(unitPrice),
        fees: parseFloat(fees || "0"),
        date,
      });

      await updateSnapshotForMonth({ yearMonth: date.substring(0, 7) });

      // Reset form
      setTicker("");
      setName("");
      setQuantity("");
      setUnitPrice("");
      setFees("0");
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de la transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle Transaction"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {accounts.length === 0 && (
          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Aucun compte trouvé. Veuillez d'abord créer un compte PEA ou CTO.</span>
          </div>
        )}

        {/* Type Toggle Pills */}
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1">
          {(["ACHAT", "VENTE", "DIVIDENDE"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-2xl py-1.5 text-xs font-semibold transition ${
                type === t
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Compte</label>
          <select
            value={accountId || accounts[0]?._id || ""}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
            required
            disabled={accounts.length === 0}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ticker (ex: CW8)</label>
            <input
              type="text"
              placeholder="CW8"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-900 uppercase focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Type d'Actif</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as any)}
              className="w-full rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
            >
              <option value="ETF">ETF</option>
              <option value="Action">Action</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nom complet (optionnel)</label>
          <input
            type="text"
            placeholder="Amundi MSCI World"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Quantité</label>
            <input
              type="number"
              step="any"
              placeholder="10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Prix (€)</label>
            <input
              type="number"
              step="any"
              placeholder="500"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Frais (€)</label>
            <input
              type="number"
              step="any"
              placeholder="0"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="w-full rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || accounts.length === 0}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            {loading ? "Enregistrement..." : "Ajouter la transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
