"use client";

import { Calendar, Upload, Plus, LogOut } from "lucide-react";

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
  onSignOut,
}: NavbarProps) {
  return (
    <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between py-3.5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-extrabold text-lg">
            ❖
          </div>
          <span className="text-2xl font-semibold tracking-tight text-slate-900 font-serif-display">
            Folio
          </span>
        </div>

        {/* Center Navigation Pill Bar */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100/90 p-1 rounded-full border border-slate-200">
          <button
            onClick={() => onTabChange("dashboard")}
            className={`px-5 py-2 text-xs font-semibold rounded-full transition ${
              activeTab === "dashboard"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange("holdings")}
            className={`px-5 py-2 text-xs font-semibold rounded-full transition ${
              activeTab === "holdings"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Positions
          </button>
          <button
            onClick={() => onTabChange("transactions")}
            className={`px-5 py-2 text-xs font-semibold rounded-full transition ${
              activeTab === "transactions"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Historique
          </button>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDca}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>DCA du Mois</span>
          </button>

          <button
            onClick={onOpenImport}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={onOpenAddTx}
            className="flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            title="Ajouter une transaction"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* User / Logout */}
          <button
            onClick={onSignOut}
            className="flex items-center rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
