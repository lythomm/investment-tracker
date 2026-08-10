"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PieChart, History } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const isDashboard = pathname === "/";
  const isPositions = pathname === "/positions";
  const isHistorique = pathname === "/historique";

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 md:hidden bg-surface/95 backdrop-blur-xl border-t border-subtle px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 gap-2 items-center max-w-lg mx-auto">
        {/* Dashboard */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-colors duration-150 select-none ${
            isDashboard
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium"
              : "text-muted hover:text-main hover:bg-slate-100/60 dark:hover:bg-slate-800/60 font-normal"
          }`}
        >
          <LayoutDashboard className="h-5 w-5 mb-0.5" />
          <span className="text-xs tracking-tight">Dashboard</span>
        </Link>

        {/* Positions */}
        <Link
          href="/positions"
          className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-colors duration-150 select-none ${
            isPositions
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium"
              : "text-muted hover:text-main hover:bg-slate-100/60 dark:hover:bg-slate-800/60 font-normal"
          }`}
        >
          <PieChart className="h-5 w-5 mb-0.5" />
          <span className="text-xs tracking-tight">Positions</span>
        </Link>

        {/* Historique */}
        <Link
          href="/historique"
          className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-colors duration-150 select-none ${
            isHistorique
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium"
              : "text-muted hover:text-main hover:bg-slate-100/60 dark:hover:bg-slate-800/60 font-normal"
          }`}
        >
          <History className="h-5 w-5 mb-0.5" />
          <span className="text-xs tracking-tight">Historique</span>
        </Link>
      </div>
    </nav>
  );
}
