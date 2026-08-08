"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, LogOut } from "lucide-react";
import { Button } from "./ui/Button";

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
    <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="relative w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between py-3.5">
        {/* Left Side: Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-extrabold text-lg">
            ❖
          </div>
          <span className="text-2xl font-semibold tracking-tight text-slate-900 font-serif-display">
            Folio
          </span>
        </Link>

        {/* Center: Real Page Navigation Links (Zero-Shift Layout) */}
        <nav className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className={`w-28 h-9 flex items-center justify-center rounded-full text-sm transition-colors duration-150 select-none ${
              isDashboard
                ? "bg-slate-900 text-white font-medium"
                : "text-slate-500 font-normal hover:text-slate-900"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/positions"
            className={`w-28 h-9 flex items-center justify-center rounded-full text-sm transition-colors duration-150 select-none ${
              isPositions
                ? "bg-slate-900 text-white font-medium"
                : "text-slate-500 font-normal hover:text-slate-900"
            }`}
          >
            Positions
          </Link>

          <Link
            href="/historique"
            className={`w-28 h-9 flex items-center justify-center rounded-full text-sm transition-colors duration-150 select-none ${
              isHistorique
                ? "bg-slate-900 text-white font-medium"
                : "text-slate-500 font-normal hover:text-slate-900"
            }`}
          >
            Historique
          </Link>
        </nav>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2">
          {onOpenAddTx && (
            <Button
              onClick={onOpenAddTx}
              variant="primary"
              size="sm"
              icon={<Plus className="h-3.5 w-3.5" />}
            >
              Transaction
            </Button>
          )}

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Logout */}
          {onSignOut && (
            <Button
              onClick={onSignOut}
              variant="secondary"
              size="xs"
              className="p-2 rounded-full border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
              title="Déconnexion"
              icon={<LogOut className="h-4 w-4" />}
            />
          )}
        </div>
      </div>
    </header>
  );
}
