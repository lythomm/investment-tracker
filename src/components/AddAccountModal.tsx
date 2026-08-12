"use client";

import { useState } from "react";
import { Wallet, CheckCircle2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Modal } from "./ui/Modal";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"PEA" | "CTO">("PEA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAccount = useMutation(api.accounts.createAccount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await createAccount({
        name: name.trim(),
        type,
      });
      setName("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-main" />
          <span className="text-2xl font-normal text-main font-serif-display">Nouveau Compte</span>
        </div>
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Nom du compte</label>
          <input
            type="text"
            placeholder="ex: PEA Fortuneo, CTO Trade Republic"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Type d'enveloppe</label>
          <div className="grid grid-cols-2 gap-2">
            {(["PEA", "CTO"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-2xl p-3 text-xs font-semibold transition cursor-pointer ${
                  type === t
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-surface-subtle border border-subtle text-muted hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {t === "PEA" ? "PEA (Plan Épargne Actions)" : "CTO (Compte Titres)"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl px-5 py-2.5 text-xs font-semibold text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-6 py-2.5 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {loading ? "Création..." : "Créer le compte"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
