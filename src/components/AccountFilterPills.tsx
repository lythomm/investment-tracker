"use client";

import { Plus } from "lucide-react";

interface AccountFilterPillsProps {
  accounts: Array<{ _id: string; name: string; type: string }>;
  selectedAccountId: string | null;
  onSelectAccount: (id: string | null) => void;
  onOpenAddAccount: () => void;
}

export function AccountFilterPills({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onOpenAddAccount,
}: AccountFilterPillsProps) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 select-none w-full">
      {/* Tous les comptes */}
      <button
        type="button"
        onClick={() => onSelectAccount(null)}
        className={`shrink-0 h-11 px-4 sm:px-5 flex items-center justify-center rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
          selectedAccountId === null
            ? "bg-slate-900 text-white shadow-xs"
            : "bg-white text-slate-600 hover:bg-slate-100"
        }`}
      >
        Tous les comptes
      </button>

      {/* Account items */}
      {accounts.map((acc) => (
        <button
          key={acc._id}
          type="button"
          onClick={() => onSelectAccount(acc._id)}
          className={`shrink-0 h-11 px-4 sm:px-5 flex items-center justify-center rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap max-w-[200px] ${
            selectedAccountId === acc._id
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="truncate">
            {acc.name} ({acc.type})
          </span>
        </button>
      ))}

      {/* Nouveau compte */}
      <button
        type="button"
        onClick={onOpenAddAccount}
        className="shrink-0 h-11 px-4 sm:px-5 flex items-center justify-center gap-1.5 rounded-2xl bg-white text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer whitespace-nowrap"
      >
        <Plus className="h-4 w-4 shrink-0" />
        <span>Nouveau Compte</span>
      </button>
    </div>
  );
}
