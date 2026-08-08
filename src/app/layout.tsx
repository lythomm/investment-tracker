import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Folio — Tracker d'Investissement Long Terme",
  description: "Suivez vos ETF et Actions sur PEA & CTO avec une interface épurée et moderne.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-200 text-slate-900 selection:bg-slate-900 selection:text-white p-2 sm:p-6 lg:p-8">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
