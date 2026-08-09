"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Search,
  Loader2,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Coins,
  Building2,
  Calendar,
} from "lucide-react";

type TransactionType = "ACHAT" | "VENTE" | "DIVIDENDE";
type AssetType = "ETF" | "Action";

interface SearchResult {
  ticker: string;
  isin?: string;
  name: string;
  type: AssetType;
  exchDisp?: string;
  currentPrice?: number;
}

export default function NewTransactionPage() {
  const router = useRouter();

  // Step control
  const [step, setStep] = useState<number>(1);

  // Form states
  const [type, setType] = useState<TransactionType>("ACHAT");
  const [accountId, setAccountId] = useState<string>("");
  const [ticker, setTicker] = useState<string>("");
  const [isin, setIsin] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [assetType, setAssetType] = useState<AssetType>("ETF");
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [fees, setFees] = useState<string>("0");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );

  // Search & Autocomplete states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Status states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Convex queries & mutations
  const accounts = useQuery(api.accounts.getAccounts) || [];
  const localAssets = useQuery(api.assets.getAssets) || [];
  const userTransactions = useQuery(api.transactions.getTransactions, {}) || [];
  const getOrCreateAsset = useMutation(api.assets.getOrCreateAsset);
  const addTransaction = useMutation(api.transactions.addTransaction);
  const updateSnapshotForMonth = useMutation(api.snapshots.updateSnapshotForMonth);

  // Pre-select account if available
  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0]._id);
    }
  }, [accounts, accountId]);

  // Debounced search for ticker autocomplete
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/assets/search?q=${encodeURIComponent(searchQuery.trim())}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Local assets matching search (restricted to assets used in user's actual transactions)
  const filteredLocalAssets = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const queryUpper = searchQuery.trim().toUpperCase();
    const userAssetIds = new Set(userTransactions.map((t: any) => t.assetId));

    return localAssets.filter(
      (a: any) =>
        userAssetIds.has(a._id) &&
        (a.ticker.toUpperCase().includes(queryUpper) ||
          a.name.toUpperCase().includes(queryUpper))
    );
  }, [localAssets, userTransactions, searchQuery]);

  const selectSearchResult = (item: SearchResult) => {
    setTicker(item.ticker);
    setName(item.name);
    if (item.isin) setIsin(item.isin);
    setAssetType(item.type);
    if (item.currentPrice && item.currentPrice > 0) {
      setCurrentPrice(item.currentPrice);
      if (!unitPrice) setUnitPrice(item.currentPrice.toString());
    }
    setSearchQuery(`${item.ticker} - ${item.name}`);
    setShowDropdown(false);
  };

  // Single Account Auto-Skip Logic
  const hasSingleAccount = accounts.length === 1;

  // Step Navigation Validation
  const canGoNextFromStep2 = !!accountId || accounts.length > 0;
  const canGoNextFromStep3 = !!ticker.trim() && !!name.trim();

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (hasSingleAccount) {
        setAccountId(accounts[0]._id);
        setStep(3);
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2 && !accountId && accounts.length > 0) {
      setAccountId(accounts[0]._id);
    }
    if (step === 2 && accounts.length === 0) {
      setError("Veuillez créer un compte (PEA ou CTO) avant de continuer.");
      return;
    }
    if (step === 3 && !ticker.trim()) {
      setError("Veuillez renseigner un Ticker d'actif.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setError(null);
    if (step === 3 && hasSingleAccount) {
      setStep(1);
      return;
    }
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetAccountId = accountId || accounts[0]?._id;

    if (!targetAccountId) {
      setError("Veuillez sélectionner un compte d'investissement.");
      return;
    }
    if (!ticker.trim()) {
      setError("Veuillez indiquer un Ticker valide.");
      return;
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      setError("Veuillez indiquer une quantité supérieure à 0.");
      return;
    }
    if (!unitPrice || parseFloat(unitPrice) <= 0) {
      setError("Veuillez indiquer un prix unitaire supérieur à 0.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const assetId = await getOrCreateAsset({
        ticker: ticker.trim().toUpperCase(),
        name: name.trim() || ticker.trim().toUpperCase(),
        isin: isin.trim() ? isin.trim().toUpperCase() : undefined,
        type: assetType,
        currentPrice: currentPrice > 0 ? currentPrice : parseFloat(unitPrice),
      });

      await addTransaction({
        accountId: targetAccountId as any,
        assetId,
        type,
        quantity: parseFloat(quantity),
        unitPrice: parseFloat(unitPrice),
        fees: parseFloat(fees || "0"),
        date,
      });

      await updateSnapshotForMonth({ yearMonth: date.substring(0, 7) });

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement de la transaction.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = hasSingleAccount
    ? ["Type d'opération", "Recherche de l'actif", "Montants & Date"]
    : [
        "Type d'opération",
        "Compte d'investissement",
        "Recherche de l'actif",
        "Montants & Date",
      ];

  const currentDisplayStep = hasSingleAccount
    ? step === 1
      ? 1
      : step === 3
      ? 2
      : 3
    : step;

  const totalDisplaySteps = hasSingleAccount ? 3 : 4;
  const progressPercentage = (currentDisplayStep / totalDisplaySteps) * 100;

  return (
    <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 pt-4 pb-12 space-y-6 max-w-5xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Retour</span>
        </button>
        <span className="text-sm font-bold text-slate-500">
          Étape {currentDisplayStep} sur {totalDisplaySteps}
        </span>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-500">
          {stepTitles.map((title, idx) => (
            <span
              key={title}
              className={idx + 1 <= currentDisplayStep ? "text-slate-900 font-bold" : ""}
            >
              {title}
            </span>
          ))}
        </div>
        <div className="h-3 w-full bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Multistep Form Card Container */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 space-y-8">
        {error && (
          <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Type d'opération */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-slate-900">
                Quel est le type d'opération ?
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2">
                Choisissez s'il s'agit d'un achat, d'une vente ou d'un dividende perçu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <button
                type="button"
                onClick={() => setType("ACHAT")}
                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-150 ${
                  type === "ACHAT"
                    ? "border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-sm"
                    : "border-slate-100 hover:border-slate-200 text-slate-600 bg-slate-50/30"
                }`}
              >
                <div
                  className={`p-4 rounded-2xl mb-4 ${
                    type === "ACHAT" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <TrendingUp className="h-8 w-8" />
                </div>
                <span className="font-bold text-lg">Achat</span>
                <span className="text-xs sm:text-sm text-slate-400 mt-1">Nouvel investissement</span>
              </button>

              <button
                type="button"
                onClick={() => setType("VENTE")}
                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-150 ${
                  type === "VENTE"
                    ? "border-rose-600 bg-rose-50/50 text-rose-950 shadow-sm"
                    : "border-slate-100 hover:border-slate-200 text-slate-600 bg-slate-50/30"
                }`}
              >
                <div
                  className={`p-4 rounded-2xl mb-4 ${
                    type === "VENTE" ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <TrendingDown className="h-8 w-8" />
                </div>
                <span className="font-bold text-lg">Vente</span>
                <span className="text-xs sm:text-sm text-slate-400 mt-1">Cession de titres</span>
              </button>

              <button
                type="button"
                onClick={() => setType("DIVIDENDE")}
                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-150 ${
                  type === "DIVIDENDE"
                    ? "border-amber-600 bg-amber-50/50 text-amber-950 shadow-sm"
                    : "border-slate-100 hover:border-slate-200 text-slate-600 bg-slate-50/30"
                }`}
              >
                <div
                  className={`p-4 rounded-2xl mb-4 ${
                    type === "DIVIDENDE" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Coins className="h-8 w-8" />
                </div>
                <span className="font-bold text-lg">Dividende</span>
                <span className="text-xs sm:text-sm text-slate-400 mt-1">Revenu d'actif</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Compte d'investissement */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-slate-900">
                Sur quel compte d'investissement ?
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2">
                Sélectionnez l'enveloppe fiscale à laquelle rattachée cette transaction.
              </p>
            </div>

            {accounts.length === 0 ? (
              <div className="rounded-3xl bg-amber-50 p-6 text-sm text-amber-900 space-y-4">
                <div className="flex items-center gap-2.5 font-bold text-base">
                  <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                  <span>Aucun compte trouvé</span>
                </div>
                <p className="text-slate-600">Vous n'avez pas encore créé de compte d'investissement (PEA ou CTO).</p>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-sm font-bold text-white hover:bg-amber-700 transition"
                >
                  <PlusCircle className="h-5 w-5" />
                  Créer mon premier compte
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts.map((acc: any) => (
                  <button
                    key={acc._id}
                    type="button"
                    onClick={() => setAccountId(acc._id)}
                    className={`flex items-center justify-between p-6 rounded-3xl border-2 text-left transition-all duration-150 ${
                      accountId === acc._id
                        ? "border-slate-900 bg-slate-900 text-white shadow-md"
                        : "border-slate-100 hover:border-slate-200 text-slate-800 bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3.5 rounded-2xl ${
                          accountId === acc._id
                            ? "bg-slate-800 text-white"
                            : "bg-white text-slate-700 shadow-sm"
                        }`}
                      >
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{acc.name}</div>
                        <div
                          className={`text-sm mt-0.5 ${
                            accountId === acc._id ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          Enveloppe : {acc.type}
                        </div>
                      </div>
                    </div>
                    {accountId === acc._id && <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Recherche & Ticker d'actif */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-slate-900">
                Quel est l'actif concerné ?
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2">
                Tapez le Ticker ou le nom de l'actif pour utiliser l'autocomplétion Yahoo Finance.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Rechercher un Ticker / Actif
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ex: CW8, AAPL, Amundi MSCI World..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full rounded-2xl bg-slate-100 pl-12 pr-12 py-3.5 text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 top-4 h-5 w-5 animate-spin text-slate-400" />
                )}
              </div>

              {/* Search Autocomplete Dropdown */}
              {showDropdown && searchQuery.trim().length > 0 && (
                <div className="absolute z-20 mt-2 w-full rounded-3xl bg-white border border-slate-100 shadow-2xl max-h-72 overflow-y-auto p-3 space-y-1.5">
                  {/* Local assets */}
                  {filteredLocalAssets.length > 0 && (
                    <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Vos actifs en portefeuille
                    </div>
                  )}
                  {filteredLocalAssets.map((asset: any) => (
                    <button
                      key={asset._id}
                      type="button"
                      onClick={() =>
                        selectSearchResult({
                          ticker: asset.ticker,
                          name: asset.name,
                          type: asset.type,
                          currentPrice: asset.currentPrice,
                        })
                      }
                      className="w-full text-left p-3.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-sm transition"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{asset.ticker}</span>
                        <span className="text-slate-600 ml-3">{asset.name}</span>
                      </div>
                      <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-600">
                        {asset.type}
                      </span>
                    </button>
                  ))}

                  {/* API results */}
                  {searchResults.length > 0 && (
                    <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">
                      Suggestions
                    </div>
                  )}
                  {searchResults.map((res, idx) => (
                    <button
                      key={`${res.ticker}-${idx}`}
                      type="button"
                      onClick={() => selectSearchResult(res)}
                      className="w-full text-left p-3.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-sm transition"
                    >
                      <div className="truncate pr-3">
                        <span className="font-bold text-slate-900">{res.ticker}</span>
                        <span className="text-slate-600 ml-3 truncate">{res.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {res.currentPrice ? (
                          <span className="font-bold text-slate-800">
                            {res.currentPrice.toFixed(2)} €
                          </span>
                        ) : null}
                        <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-600">
                          {res.type}
                        </span>
                      </div>
                    </button>
                  ))}

                  {!isSearching &&
                    filteredLocalAssets.length === 0 &&
                    searchResults.length === 0 && (
                      <div className="p-4 text-center text-sm text-slate-400">
                        Aucun résultat trouvé pour "{searchQuery}". Vous pouvez remplir les champs ci-dessous.
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Ticker & Asset Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Ticker (symbole boursier)
                </label>
                <input
                  type="text"
                  placeholder="CW8"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-base font-bold uppercase text-slate-900 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Type d'actif
                </label>
                <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5">
                  {(["ETF", "Action"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAssetType(t)}
                      className={`rounded-xl py-2.5 text-sm font-bold transition ${
                        assetType === t
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Nom complet de l'actif
              </label>
              <input
                type="text"
                placeholder="Ex: Amundi MSCI World UCITS ETF"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-base font-medium text-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>
        )}

        {/* STEP 4: Quantité, Prix, Frais & Date */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-slate-900">
                Détails financiers & Date
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2">
                Saisissez la quantité, le prix unitaire d'exécution, les frais et la date.
              </p>
            </div>

            {/* Summary Banner Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl bg-slate-100 p-6 gap-4 text-sm">
              <div>
                <div className="text-slate-400 font-medium text-xs uppercase tracking-wider">Actif sélectionné</div>
                <div className="font-bold text-base text-slate-900 mt-0.5">{ticker} — {name}</div>
              </div>
              <div className="sm:text-right">
                <div className="text-slate-400 font-medium text-xs uppercase tracking-wider">Opération & Compte</div>
                <div className="font-bold text-base text-slate-800 mt-0.5">
                  {type} • {accounts.find((a: any) => a._id === accountId)?.name || "Compte"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-base font-medium text-slate-900 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Prix unitaire (€)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="500"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-base font-medium text-slate-900 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Frais (€)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  className="w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-base font-medium text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Date de l'opération
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl bg-slate-100 pl-12 pr-4 py-3.5 text-base font-medium text-slate-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Total Calculation Display */}
            {quantity && unitPrice && (
              <div className="rounded-3xl bg-emerald-50 p-6 flex items-center justify-between text-emerald-950">
                <span className="font-bold text-base">Total estimé de l'opération :</span>
                <span className="font-extrabold text-xl sm:text-2xl">
                  {(
                    parseFloat(quantity || "0") * parseFloat(unitPrice || "0") +
                    parseFloat(fees || "0")
                  ).toFixed(2)}{" "}
                  €
                </span>
              </div>
            )}
          </form>
        )}

        {/* Action Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 2 && !canGoNextFromStep2) ||
                (step === 3 && !canGoNextFromStep3)
              }
              className="flex items-center gap-2.5 rounded-2xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
            >
              <span>Suivant</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
              <span>Enregistrer la transaction</span>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
