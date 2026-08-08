import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Folio — Tracker d'Investissement Long Terme (DCA)",
  description: "Suivez vos ETF et Actions sur PEA & CTO. Visualisez votre patrimoine et plus-values sur 5 à 10 ans.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark h-full antialiased">
      <body className={`${inter.className} min-h-full bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300`}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
