"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Modal } from "./ui/Modal";

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Array<{ _id: string; name: string; type: "PEA" | "CTO" }>;
}

export function CsvImportModal({ isOpen, onClose, accounts }: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const getOrCreateAsset = useMutation(api.assets.getOrCreateAsset);
  const addBatchTransactions = useMutation(api.transactions.addBatchTransactions);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError(null);
    setSuccessCount(null);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
      },
      error: (err) => {
        setError("Erreur de lecture du fichier CSV: " + err.message);
      },
    });
  };

  const handleImport = async () => {
    if (!parsedData.length) return;
    setLoading(true);
    setError(null);

    try {
      const itemsToSubmit = [];
      const defaultAccount = accounts[0]?._id;

      for (const row of parsedData) {
        const ticker = (row.Ticker || row.ticker || row.Symbol || row.symbol || "").toString().trim().toUpperCase();
        const date = (row.Date || row.date || new Date().toISOString().substring(0, 10)).toString().trim();
        const quantity = parseFloat(row.Quantity || row.quantity || row.Quantité || row.quantite || "0");
        const price = parseFloat(row.Price || row.price || row.Prix || row.prix || "0");
        const fees = parseFloat(row.Fees || row.fees || row.Frais || row.frais || "0");
        const typeRaw = (row.Type || row.type || "ACHAT").toString().trim().toUpperCase();

        if (!ticker || quantity <= 0 || price <= 0) continue;

        const assetId = await getOrCreateAsset({
          ticker,
          name: row.Name || row.name || ticker,
          type: ticker.length === 3 ? "ETF" : "Action",
          currentPrice: price,
        });

        itemsToSubmit.push({
          accountId: (row.accountId || defaultAccount) as any,
          assetId,
          type: typeRaw === "VENTE" ? ("VENTE" as const) : typeRaw === "DIVIDENDE" ? ("DIVIDENDE" as const) : ("ACHAT" as const),
          quantity,
          unitPrice: price,
          fees,
          date,
        });
      }

      if (!itemsToSubmit.length) {
        throw new Error("Aucune ligne valide trouvée dans le CSV. Assurez-vous d'avoir les colonnes: Ticker, Date, Quantity, Price.");
      }

      await addBatchTransactions({ items: itemsToSubmit });
      setSuccessCount(itemsToSubmit.length);
      setTimeout(() => {
        onClose();
        setSuccessCount(null);
        setParsedData([]);
        setFile(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'importation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-slate-800" />
          <span className="text-2xl font-normal text-slate-900 font-serif-display">Importation CSV / Excel</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {successCount !== null && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successCount} transactions importées avec succès !
          </div>
        )}

        {/* Drag & Drop File Input */}
        <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 hover:border-slate-400 transition">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <FileText className="mx-auto h-10 w-10 text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-800">
            {file ? file.name : "Cliquez ou glissez un fichier CSV ici"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Colonnes requises : <code className="text-slate-900 font-bold">Date, Ticker, Quantity, Price</code>
          </p>
        </div>

        {/* Preview Table */}
        {parsedData.length > 0 && (
          <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-600 mb-2">Aperçu ({parsedData.length} lignes) :</p>
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="p-1">Date</th>
                  <th className="p-1">Ticker</th>
                  <th className="p-1">Quantité</th>
                  <th className="p-1">Prix (€)</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-1">{row.Date || row.date}</td>
                    <td className="p-1 font-bold text-slate-900">{row.Ticker || row.ticker}</td>
                    <td className="p-1">{row.Quantity || row.quantity}</td>
                    <td className="p-1">{row.Price || row.price} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-2xl px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleImport}
            disabled={loading || !parsedData.length}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition disabled:opacity-40"
          >
            {loading ? "Importation..." : "Importer les transactions"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
