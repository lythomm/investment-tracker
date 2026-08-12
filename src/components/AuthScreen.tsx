"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Lock, Mail, ArrowRight } from "lucide-react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn("password", {
        email,
        password,
        flow: step,
      });
    } catch (err: any) {
      console.error(err);
      setError(
        step === "signIn"
          ? "Identifiants incorrects ou compte inexistant."
          : "Erreur lors de la création du compte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#edf1f2] p-4 text-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 sm:p-10">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 font-extrabold text-2xl text-white mb-3">
            ❖
          </div>
          <h1 className="text-3xl font-normal tracking-tight text-slate-900 font-serif-display">
            Folio
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Votre cockpit d'investissement ETF & Actions épuré.
          </p>
        </div>

        {/* Auth Toggle Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1.5">
          <button
            type="button"
            onClick={() => {
              setStep("signIn");
              setError(null);
            }}
            className={`rounded-2xl py-2 text-xs font-semibold transition ${
              step === "signIn"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("signUp");
              setError(null);
            }}
            className={`rounded-2xl py-2 text-xs font-semibold transition ${
              step === "signUp"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted pointer-events-none z-10" />
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input !pl-10 !pr-4"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted pointer-events-none z-10" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input !pl-10 !pr-4"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            <span>{step === "signIn" ? "Connexion" : "Créer mon compte"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
