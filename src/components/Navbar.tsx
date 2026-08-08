"use client";

import { Plus, LogOut } from "lucide-react";

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
  onOpenAddTx,
  onSignOut,
}: NavbarProps) {
  return (
    <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="relative w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between py-3.5">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-extrabold text-lg">
            ❖
          </div>
          <span className="text-2xl font-semibold tracking-tight text-slate-900 font-serif-display">
            Folio
          </span>
        </div>

        {/* Center: Perfectly Centered Navigation Links (Matching Screenshot) */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => onTabChange("dashboard")}
            className={`transition ${
              activeTab === "dashboard"
                ? "bg-slate-900 text-white rounded-full px-6 py-2 text-sm font-medium"
                : "text-slate-500 font-normal hover:text-slate-900 px-2 py-2 text-sm"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange("holdings")}
            className={`transition ${
              activeTab === "holdings"
                ? "bg-slate-900 text-white rounded-full px-6 py-2 text-sm font-medium"
                : "text-slate-500 font-normal hover:text-slate-900 px-2 py-2 text-sm"
            }`}
          >
            Positions
          </button>
          <button
            onClick={() => onTabChange("transactions")}
            className={`transition ${
              activeTab === "transactions"
                ? "bg-slate-900 text-white rounded-full px-6 py-2 text-sm font-medium"
                : "text-slate-500 font-normal hover:text-slate-900 px-2 py-2 text-sm"
            }`}
          >
            Historique
          </button>
        </nav>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddTx}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            title="Ajouter une transaction"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Transaction</span>
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Logout */}
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
