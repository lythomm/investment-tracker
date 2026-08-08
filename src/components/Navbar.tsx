"use client";

import { Plus, Upload, Calendar, Wallet, LogOut } from "lucide-react";

interface NavbarProps {
  onOpenDca: () => void;
  onOpenImport: () => void;
  onOpenAddTx: () => void;
  onOpenAddAccount: () => void;
  onSignOut: () => void;
  selectedAccountId: string | null;
  onSelectAccount: (id: string | null) => void;
  accounts: Array<{ _id: string; name: string; type: "PEA" | "CTO" }>;
}

export function Navbar({
  onOpenDca,
  onOpenImport,
  onOpenAddTx,
  onOpenAddAccount,
  onSignOut,
  selectedAccountId,
  onSelectAccount,
  accounts,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo & Account Selector */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
              F
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Folio
            </span>
          </div>

          {/* Account Filter Pills */}
          <div className="hidden items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 p-1 md:flex">
            <button
              onClick={() => onSelectAccount(null)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                selectedAccountId === null
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Tous les comptes
            </button>
            {accounts.map((acc) => (
              <button
                key={acc._id}
                onClick={() => onSelectAccount(acc._id)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                  selectedAccountId === acc._id
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {acc.name} ({acc.type})
              </button>
            ))}
            <button
              onClick={onOpenAddAccount}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
              title="Ajouter un compte PEA / CTO"
            >
              <Plus className="h-3.5 w-3.5" />
              Nouveau
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenDca}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-md transition hover:from-emerald-400 hover:to-teal-400 sm:px-4 sm:py-2 sm:text-sm"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Formulaire</span> DCA du Mois
          </button>

          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 sm:px-3.5 sm:py-2 sm:text-sm"
          >
            <Upload className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Import</span> CSV/Excel
          </button>

          <button
            onClick={onOpenAddTx}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 p-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 sm:px-3 sm:py-2 sm:text-sm"
            title="Ajouter une transaction unitaire"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Transaction</span>
          </button>

          <button
            onClick={onSignOut}
            className="flex items-center rounded-xl border border-slate-800 p-2 text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Account Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-800/60 px-4 py-2 md:hidden">
        <button
          onClick={() => onSelectAccount(null)}
          className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium ${
            selectedAccountId === null
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-slate-900 text-slate-400"
          }`}
        >
          Tous les comptes
        </button>
        {accounts.map((acc) => (
          <button
            key={acc._id}
            onClick={() => onSelectAccount(acc._id)}
            className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium ${
              selectedAccountId === acc._id
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-900 text-slate-400"
            }`}
          >
            {acc.name} ({acc.type})
          </button>
        ))}
        <button
          onClick={onOpenAddAccount}
          className="flex whitespace-nowrap items-center gap-1 rounded-lg bg-slate-900 px-2 py-1 text-xs text-slate-400"
        >
          <Plus className="h-3 w-3" /> Compte
        </button>
      </div>
    </header>
  );
}
