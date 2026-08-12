"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/Toast";
import {
  TrendingUp,
  TrendingDown,
  Coins,
  Trash2,
  AlertCircle,
  Save,
  Building2,
} from "lucide-react";

export interface TransactionItem {
  _id: string;
  accountId: string;
  assetId: string;
  type: "ACHAT" | "VENTE" | "DIVIDENDE";
  quantity: number;
  unitPrice: number;
  fees: number;
  date: string;
  asset?: { _id?: string; ticker: string; name: string; type: string } | null;
  account?: { _id?: string; name: string; type: string } | null;
}

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionItem | null;
}

export function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
}: EditTransactionModalProps) {
  const { showToast } = useToast();
  const accounts = useQuery(api.accounts.getAccounts) || [];
  const assets = useQuery(api.assets.getAssets) || [];

  const updateTransaction = useMutation(api.transactions.updateTransaction);
  const deleteTransaction = useMutation(api.transactions.deleteTransaction);

  const [type, setType] = useState<"ACHAT" | "VENTE" | "DIVIDENDE">("ACHAT");
  const [accountId, setAccountId] = useState<string>("");
  const [assetId, setAssetId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [fees, setFees] = useState<string>("0");
  const [date, setDate] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAccountId(transaction.accountId);
      setAssetId(transaction.assetId);
      setQuantity(transaction.quantity.toString());
      setUnitPrice(transaction.unitPrice.toString());
      setFees(transaction.fees.toString());
      setDate(transaction.date);
      setError(null);
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) {
      const msg = "Veuillez sélectionner un compte.";
      setError(msg);
      showToast("danger", msg);
      return;
    }
    if (!assetId) {
      const msg = "Veuillez sélectionner un actif.";
      setError(msg);
      showToast("danger", msg);
      return;
    }
    const q = parseFloat(quantity);
    if (isNaN(q) || q <= 0) {
      const msg = "La quantité doit être supérieure à 0.";
      setError(msg);
      showToast("danger", msg);
      return;
    }
    const p = parseFloat(unitPrice);
    if (isNaN(p) || p <= 0) {
      const msg = "Le prix unitaire doit être supérieur à 0.";
      setError(msg);
      showToast("danger", msg);
      return;
    }
    const f = parseFloat(fees || "0");
    if (isNaN(f) || f < 0) {
      const msg = "Les frais ne peuvent pas être négatifs.";
      setError(msg);
      showToast("danger", msg);
      return;
    }
    if (!date) {
      const msg = "Veuillez renseigner une date valide.";
      setError(msg);
      showToast("danger", msg);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateTransaction({
        id: transaction._id as any,
        accountId: accountId as any,
        assetId: assetId as any,
        type,
        quantity: q,
        unitPrice: p,
        fees: f,
        date,
      });
      showToast("success", "Transaction modifiée avec succès.");
      onClose();
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors de la modification de la transaction.";
      setError(errorMsg);
      showToast("danger", errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTransaction({ id: transaction._id as any });
      showToast("success", "Transaction supprimée avec succès.");
      setShowConfirmDelete(false);
      onClose();
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors de la suppression de la transaction.";
      setError(errorMsg);
      showToast("danger", errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };


  const totalCalculated =
    (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0) + (parseFloat(fees) || 0);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Détails & Modification"
        description="Consultez et modifiez les informations de cette transaction ou supprimez-la."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-4 text-sm font-semibold text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Type d'opération
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType("ACHAT")}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-sm transition cursor-pointer ${
                  type === "ACHAT"
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                    : "border-subtle bg-surface-subtle text-muted hover:text-main"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Achat</span>
              </button>

              <button
                type="button"
                onClick={() => setType("VENTE")}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-sm transition cursor-pointer ${
                  type === "VENTE"
                    ? "border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
                    : "border-subtle bg-surface-subtle text-muted hover:text-main"
                }`}
              >
                <TrendingDown className="h-4 w-4" />
                <span>Vente</span>
              </button>

              <button
                type="button"
                onClick={() => setType("DIVIDENDE")}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-sm transition cursor-pointer ${
                  type === "DIVIDENDE"
                    ? "border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                    : "border-subtle bg-surface-subtle text-muted hover:text-main"
                }`}
              >
                <Coins className="h-4 w-4" />
                <span>Dividende</span>
              </button>
            </div>
          </div>

          {/* Account & Asset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Compte d'investissement
              </label>
              <div className="relative">
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="input-select"
                >
                  {accounts.map((acc: any) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name} ({acc.type})
                    </option>
                  ))}
                </select>
                <Building2 className="absolute right-4 top-3.5 h-4 w-4 text-muted pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Actif rattaché
              </label>
              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="input-select"
              >
                {assets.map((ast: any) => (
                  <option key={ast._id} value={ast._id}>
                    {ast.ticker} - {ast.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amounts & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Quantité
              </label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Prix unitaire (€)
              </label>
              <input
                type="number"
                step="any"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Frais (€)
              </label>
              <input
                type="number"
                step="any"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Date de l'opération
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker?.();
                  } catch {}
                }}
                className="input cursor-pointer"
                required
              />

            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Total calculé
              </label>
              <div className="w-full rounded-2xl bg-surface-subtle border border-subtle px-4 py-3 text-base font-bold text-main">
                {totalCalculated.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-subtle">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </button>

            <div className="w-full sm:w-auto flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" size="md" onClick={onClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                icon={<Save className="h-4 w-4" />}
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Supprimer la transaction"
        message="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
      />
    </>
  );
}
