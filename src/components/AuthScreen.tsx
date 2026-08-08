"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn("password", { email, password, flow: step });
    } catch (err: any) {
      setError(err.message || "Erreur d'authentification. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-200 p-4 relative overflow-hidden">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white border border-slate-100 p-8 sm:p-10 shadow-2xl">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 font-extrabold text-2xl text-white shadow-md mb-3">
            ❖
          </div>
          <h1 className="text-3xl font-normal tracking-tight text-slate-900 font-serif-display">
            Folio
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Tracker d'Investissement Long Terme (DCA, PEA & CTO)
          </p>
        </div>

        {/* Tab Selector */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1.5 border border-slate-200">
          <button
            onClick={() => {
              setStep("signIn");
              setError(null);
            }}
            className={`rounded-full py-2 text-xs font-semibold transition ${
              step === "signIn"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => {
              setStep("signUp");
              setError(null);
            }}
            className={`rounded-full py-2 text-xs font-semibold transition ${
              step === "signUp"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Créer un compte
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="investisseur@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:opacity-50"
          >
            <span>{loading ? "Chargement..." : step === "signIn" ? "Connexion" : "S'inscrire"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Données d'investissement isolées & sécurisées
        </div>
      </div>
    </div>
  );
}
