"use client";

import { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "./Navbar";
import { MobileBottomNav } from "./MobileBottomNav";
import { AddAccountModal } from "./AddAccountModal";
import { AuthScreen } from "./AuthScreen";
import { PriceAutoSync } from "./PriceAutoSync";
import { Loader2 } from "lucide-react";

interface ModalContextType {
  openAddTransaction: () => void;
  openAddAccount: () => void;
  accounts: Array<{ _id: string; name: string; type: "PEA" | "CTO" }>;
}

const ModalContext = createContext<ModalContextType>({
  openAddTransaction: () => {},
  openAddAccount: () => {},
  accounts: [],
});

export const useModals = () => useContext(ModalContext);

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated: rawIsAuthenticated, isLoading } = useConvexAuth();
  const isE2E = typeof window !== "undefined" && window.location.search.includes("e2e=true");
  const isAuthenticated = rawIsAuthenticated || isE2E;
  const { signOut } = useAuthActions();

  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  const rawAccounts = useQuery(api.accounts.getAccounts, isAuthenticated ? {} : "skip");
  const accounts = rawAccounts || [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf1f2] text-slate-900">
        <Loader2 className="h-8 w-8 animate-spin font-sans" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <ModalContext.Provider
      value={{
        openAddTransaction: () => router.push("/transactions/new"),
        openAddAccount: () => setIsAddAccountOpen(true),
        accounts,
      }}
    >
      <div className="min-h-screen w-full bg-[#edf1f2] text-slate-900 flex flex-col pb-28 md:pb-12">
        <PriceAutoSync />
        {/* Rendered ONCE Globally for all pages */}
        <Navbar
          onOpenAddTx={() => router.push("/transactions/new")}
          onSignOut={() => signOut()}
        />

        {/* Active Page View */}
        {children}

        {/* Fixed Mobile Bottom Navigation Bar */}
        <MobileBottomNav />

        {/* Global Modals */}
        <AddAccountModal
          isOpen={isAddAccountOpen}
          onClose={() => setIsAddAccountOpen(false)}
        />
      </div>
    </ModalContext.Provider>
  );
}
