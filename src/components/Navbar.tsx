"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, LogOut } from "lucide-react";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  onOpenAddTx?: () => void;
  onSignOut?: () => void;
}

export function Navbar({
  onOpenAddTx,
  onSignOut,
}: NavbarProps) {
  const pathname = usePathname();

  const isDashboard = pathname === "/";
  const isPositions = pathname === "/positions";
  const isHistorique = pathname === "/historique";

  return (
    <header className="w-full bg-[var(--nav-bg)] backdrop-blur-md sticky top-0 z-40">
      <div className="relative w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between py-4">
        {/* Left Side: Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xl transition-colors">
            ❖
          </div>
          <span className="text-3xl font-semibold tracking-tight text-main font-serif-display">
            Folio
          </span>
        </Link>

        {/* Center: Real Page Navigation Links (Zero-Shift Layout) */}
        <nav className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className={`w-36 h-10 flex items-center justify-center rounded-2xl text-base transition-colors duration-150 select-none ${
              isDashboard
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium"
                : "text-muted font-normal hover:text-main"
            }`}
          >
            Tableau de bord
          </Link>

          <Link
            href="/positions"
            className={`w-32 h-10 flex items-center justify-center rounded-2xl text-base transition-colors duration-150 select-none ${
              isPositions
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium"
                : "text-muted font-normal hover:text-main"
            }`}
          >
            Positions
          </Link>

          <Link
            href="/historique"
            className={`w-32 h-10 flex items-center justify-center rounded-2xl text-base transition-colors duration-150 select-none ${
              isHistorique
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium"
                : "text-muted font-normal hover:text-main"
            }`}
          >
            Historique
          </Link>
        </nav>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2.5">
          {onOpenAddTx && (
            <Button
              onClick={onOpenAddTx}
              variant="primary"
              size="md"
              icon={<Plus className="h-4 w-4" />}
            >
              Transaction
            </Button>
          )}

          <ThemeToggle />

          {/* Logout */}
          {onSignOut && (
            <Button
              onClick={onSignOut}
              variant="secondary"
              size="sm"
              className="p-2.5 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400"
              title="Déconnexion"
              icon={<LogOut className="h-4 w-4" />}
            />
          )}
        </div>
      </div>
    </header>
  );
}
