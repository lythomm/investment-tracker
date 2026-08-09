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
    <header className="w-full border-b border-slate-200/80 bg-[#edf1f2]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="relative w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between py-4">
        {/* Left Side: Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-extrabold text-xl">
            ❖
          </div>
          <span className="text-3xl font-semibold tracking-tight text-slate-900 font-serif-display">
            Folio
          </span>
        </Link>

        {/* Center: Real Page Navigation Links (Zero-Shift Layout) */}
        <nav className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className={`w-32 h-10 flex items-center justify-center rounded-full text-base transition-colors duration-150 select-none ${
              isDashboard
                ? "bg-slate-900 text-white font-medium"
                : "text-slate-500 font-normal hover:text-slate-900"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/positions"
            className={`w-32 h-10 flex items-center justify-center rounded-full text-base transition-colors duration-150 select-none ${
              isPositions
                ? "bg-slate-900 text-white font-medium"
                : "text-slate-500 font-normal hover:text-slate-900"
            }`}
          >
            Positions
          </Link>

          <Link
            href="/historique"
            className={`w-32 h-10 flex items-center justify-center rounded-full text-base transition-colors duration-150 select-none ${
              isHistorique
                ? "bg-slate-900 text-white font-medium"
                : "text-slate-500 font-normal hover:text-slate-900"
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

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Logout */}
          {onSignOut && (
            <Button
              onClick={onSignOut}
              variant="secondary"
              size="sm"
              className="p-2.5 rounded-full border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
              title="Déconnexion"
              icon={<LogOut className="h-4 w-4" />}
            />
          )}
        </div>
      </div>
    </header>
  );
}
