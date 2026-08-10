"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

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
        className="relative shrink-0 h-11 px-4 sm:px-5 flex items-center justify-center rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap bg-surface text-muted hover:text-main border border-subtle overflow-hidden"
      >
        {selectedAccountId === null && (
          <motion.div
            layoutId="activePillBg"
            className="absolute inset-0 bg-slate-900 dark:bg-slate-100"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className={`relative z-10 ${selectedAccountId === null ? "text-white dark:text-slate-900" : ""}`}>
          Tous les comptes
        </span>
      </button>

      {/* Account items */}
      {accounts.map((acc) => {
        const isSelected = selectedAccountId === acc._id;
        return (
          <button
            key={acc._id}
            type="button"
            onClick={() => onSelectAccount(acc._id)}
            className="relative shrink-0 h-11 px-4 sm:px-5 flex items-center justify-center rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap max-w-[200px] bg-surface text-muted hover:text-main border border-subtle overflow-hidden"
          >
            {isSelected && (
              <motion.div
                layoutId="activePillBg"
                className="absolute inset-0 bg-slate-900 dark:bg-slate-100"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 truncate ${isSelected ? "text-white dark:text-slate-900" : ""}`}>
              {acc.name} ({acc.type})
            </span>
          </button>
        );
      })}

      {/* Nouveau compte */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onOpenAddAccount}
        className="shrink-0 h-11 px-4 sm:px-5 flex items-center justify-center gap-1.5 rounded-2xl bg-surface text-xs sm:text-sm font-medium text-muted hover:text-main hover:bg-slate-100 dark:hover:bg-slate-800 border border-subtle cursor-pointer whitespace-nowrap"
      >
        <Plus className="h-4 w-4 shrink-0" />
        <span>Nouveau Compte</span>
      </motion.button>
    </div>
  );
}
