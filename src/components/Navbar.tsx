"use client";

import { Calendar, Upload, Plus, LogOut, Wallet, Layers, LayoutDashboard } from "lucide-react";

interface NavbarProps {
  activeTab: "dashboard" | "transactions" | "holdings";
  onTabChange: (tab: "dashboard" | "transactions" | "holdings") => void;
  onOpenDca: () => void;
  onOpenImport: () => void;
  onOpenAddTx: () => void;
  onOpenAddAccount: () => void;
  onSignOut: () => void;
  accounts: Array<{ _id: string; name: string; type: "PEA" | "CTO" }>;
}

export function Navbar({
  activeTab,
  onTabChange,
  onOpenDca,
  onOpenImport,
  onOpenAddTx,
  onOpenAddAccount,
  onSignOut,
  accounts,
}: NavbarProps) {
  return (
    <header className="w-full max-w-[1400px] mx-auto px-4 pt-4 pb-2">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950 font-extrabold text-xl shadow-lg">
            ❖
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Folio
            </span>
            <span className="ml-2 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              Tracker
            </span>
          </div>
        </div>

        {/* Center Pill Navigation */}
        <div className="hidden md:flex items-center gap-1 nav-pill">
          <button
            onClick={() => onTabChange("dashboard")}
            className={`nav-pill-item flex items-center gap-1.5 ${
              activeTab === "dashboard"
                ? "nav-pill-item-active"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => onTabChange("holdings")}
            className={`nav-pill-item flex items-center gap-1.5 ${
              activeTab === "holdings"
                ? "nav-pill-item-active"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="h-4 w-4" />
            Positions ({accounts.length})
          </button>
          <button
            onClick={() => onTabChange("transactions")}
            className={`nav-pill-item flex items-center gap-1.5 ${
              activeTab === "transactions"
                ? "nav-pill-item-active"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Historique
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDca}
            className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>DCA du Mois</span>
          </button>

          <button
            onClick={onOpenImport}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
          >
            <Upload className="h-3.5 w-3.5 text-slate-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={onOpenAddTx}
            className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
            title="Ajouter une transaction"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onOpenAddAccount}
            className="hidden lg:flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            title="Nouveau compte"
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>Compte</span>
          </button>

          <button
            onClick={onSignOut}
            className="flex items-center rounded-full border border-slate-800 p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
