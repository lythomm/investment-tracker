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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="glass-card relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 font-extrabold text-2xl text-slate-950 shadow-xl shadow-emerald-500/20 mb-3">
            F
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Folio
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Tracker d'Investissement Long Terme (DCA, PEA & CTO)
          </p>
        </div>

        {/* Tab Selector */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => {
              setStep("signIn");
              setError(null);
            }}
            className={`rounded-lg py-2 text-xs font-semibold transition ${
              step === "signIn"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => {
              setStep("signUp");
              setError(null);
            }}
            className={`rounded-lg py-2 text-xs font-semibold transition ${
              step === "signUp"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Créer un compte
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                placeholder="investisseur@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50"
          >
            <span>{loading ? "Chargement..." : step === "signIn" ? "Connexion" : "S'inscrire"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Données d'investissement chiffrées & isolées
        </div>
      </div>
    </div>
  );
}
