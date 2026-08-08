"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-slate-950 text-white flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">Une erreur est survenue</h2>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
