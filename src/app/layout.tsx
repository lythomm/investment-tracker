import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { AppShell } from "@/components/AppShell";

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
    <html lang="fr" className="h-full antialiased">
      <head>
        <link key="font-gambarino" rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=gambarino@400&display=swap" />
        <link key="font-satoshi" rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap" />
      </head>
      <body className="min-h-full bg-[#edf1f2] text-slate-900 selection:bg-slate-900 selection:text-white">
        <ConvexClientProvider>
          <AppShell>{children}</AppShell>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
