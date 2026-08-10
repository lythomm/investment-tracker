import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const seedUserPortfolio = mutation({
  args: {
    targetUserId: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    let userId = args.targetUserId;
    if (!userId) {
      const authId = await getAuthUserId(ctx);
      userId = authId || "kd7b4j9ewva0h2sxke2tk2h3718c2pt0";
    }

    // 1. Get or create accounts (PEA and CTO) for target user
    const existingAccounts = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();

    let peaAccountId = existingAccounts.find((a: any) => a.type === "PEA")?._id;
    if (!peaAccountId) {
      peaAccountId = await ctx.db.insert("accounts", {
        userId,
        name: "PEA BoursoBank",
        type: "PEA",
        createdAt: Date.now(),
      });
    }

    let ctoAccountId = existingAccounts.find((a: any) => a.type === "CTO")?._id;
    if (!ctoAccountId) {
      ctoAccountId = await ctx.db.insert("accounts", {
        userId,
        name: "CTO Trade Republic",
        type: "CTO",
        createdAt: Date.now(),
      });
    }

    // 2. Define varied assets (ETFs & Actions)
    const assetsData = [
      { ticker: "CW8.PA", isin: "LU1681043599", name: "Amundi MSCI World UCITS ETF", type: "ETF" as const, currentPrice: 520.40 },
      { ticker: "WPEA.PA", isin: "IE0002XZSHO1", name: "iShares MSCI World Swap PEA UCITS ETF", type: "ETF" as const, currentPrice: 6.85 },
      { ticker: "PUST.PA", isin: "FR0011871110", name: "Amundi PEA NASDAQ-100 UCITS ETF", type: "ETF" as const, currentPrice: 104.50 },
      { ticker: "PAASI.PA", isin: "FR0013412012", name: "Amundi PEA Asie Émergente MSCI UCITS ETF", type: "ETF" as const, currentPrice: 41.20 },
      { ticker: "MC.PA", isin: "FR0000121014", name: "LVMH Moët Hennessy Louis Vuitton", type: "Action" as const, currentPrice: 685.00 },
      { ticker: "TTE.PA", isin: "FR0000120271", name: "TotalEnergies SE", type: "Action" as const, currentPrice: 62.30 },
      { ticker: "AIR.PA", isin: "NL0000235190", name: "Airbus SE", type: "Action" as const, currentPrice: 138.60 },
      { ticker: "SAN.PA", isin: "FR0000120578", name: "Sanofi SA", type: "Action" as const, currentPrice: 89.40 },
      { ticker: "AAPL", isin: "US0378331005", name: "Apple Inc.", type: "Action" as const, currentPrice: 215.50 },
      { ticker: "NVDA", isin: "US67066G1040", name: "NVIDIA Corporation", type: "Action" as const, currentPrice: 125.80 },
      { ticker: "MSFT", isin: "US5949181045", name: "Microsoft Corporation", type: "Action" as const, currentPrice: 440.20 },
    ];

    const assetIdMap = new Map<string, any>();
    for (const assetDef of assetsData) {
      let existingAsset = await ctx.db
        .query("assets")
        .withIndex("by_ticker", (q: any) => q.eq("ticker", assetDef.ticker))
        .unique();

      if (!existingAsset) {
        const id = await ctx.db.insert("assets", {
          ticker: assetDef.ticker,
          isin: assetDef.isin,
          name: assetDef.name,
          type: assetDef.type,
          currentPrice: assetDef.currentPrice,
          updatedAt: Date.now(),
        });
        assetIdMap.set(assetDef.ticker, id);
      } else {
        assetIdMap.set(assetDef.ticker, existingAsset._id);
      }
    }

    // 3. Clean existing transactions for this user
    const existingTxs = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();

    for (const tx of existingTxs) {
      await ctx.db.delete(tx._id);
    }

    // 4. Generate 110+ realistic DCA and dividend transactions over 32 months (Jan 2024 to Aug 2026)
    const txList: Array<{
      account: "PEA" | "CTO";
      ticker: string;
      type: "ACHAT" | "VENTE" | "DIVIDENDE";
      quantity: number;
      unitPrice: number;
      fees: number;
      date: string;
    }> = [];

    // Monthly recurrence setup
    for (let year = 2024; year <= 2026; year++) {
      const maxMonth = year === 2026 ? 8 : 12;
      for (let month = 1; month <= maxMonth; month++) {
        const monthStr = String(month).padStart(2, "0");
        const dateDCA = `${year}-${monthStr}-05`;
        const dateMid = `${year}-${monthStr}-18`;

        // Monthly DCA on PEA (CW8, WPEA, PUST)
        const cw8Price = 430 + (year - 2024) * 35 + month * 2.5 + (month % 3);
        txList.push({
          account: "PEA",
          ticker: "CW8.PA",
          type: "ACHAT",
          quantity: 1,
          unitPrice: Math.round(cw8Price * 100) / 100,
          fees: 1.99,
          date: dateDCA,
        });

        const wpeaPrice = 5.50 + (year - 2024) * 0.5 + month * 0.04;
        txList.push({
          account: "PEA",
          ticker: "WPEA.PA",
          type: "ACHAT",
          quantity: 50,
          unitPrice: Math.round(wpeaPrice * 10000) / 10000,
          fees: 0.0,
          date: dateDCA,
        });

        const pustPrice = 85 + (year - 2024) * 8 + month * 0.6;
        txList.push({
          account: "PEA",
          ticker: "PUST.PA",
          type: "ACHAT",
          quantity: 2,
          unitPrice: Math.round(pustPrice * 100) / 100,
          fees: 1.20,
          date: dateMid,
        });

        // CTO purchases (Tech US)
        if (month % 2 === 1) {
          const nvdaPrice = 75 + (year - 2024) * 20 + month * 1.5;
          txList.push({
            account: "CTO",
            ticker: "NVDA",
            type: "ACHAT",
            quantity: 3,
            unitPrice: Math.round(nvdaPrice * 100) / 100,
            fees: 1.0,
            date: dateDCA,
          });
        } else {
          const aaplPrice = 170 + (year - 2024) * 15 + month * 1.2;
          txList.push({
            account: "CTO",
            ticker: "AAPL",
            type: "ACHAT",
            quantity: 2,
            unitPrice: Math.round(aaplPrice * 100) / 100,
            fees: 1.0,
            date: dateMid,
          });
        }

        // Quarterly Dividends (TotalEnergies & LVMH)
        if (month === 3 || month === 6 || month === 9 || month === 12) {
          txList.push({
            account: "PEA",
            ticker: "TTE.PA",
            type: "DIVIDENDE",
            quantity: 25,
            unitPrice: 0.79,
            fees: 0.0,
            date: `${year}-${monthStr}-25`,
          });
        }
        if (month === 4 || month === 11) {
          txList.push({
            account: "PEA",
            ticker: "MC.PA",
            type: "DIVIDENDE",
            quantity: 2,
            unitPrice: 7.50,
            fees: 0.0,
            date: `${year}-${monthStr}-28`,
          });
        }
      }
    }

    // Add punctual purchases & sales for rebalancing
    txList.push({
      account: "PEA",
      ticker: "PAASI.PA",
      type: "ACHAT",
      quantity: 15,
      unitPrice: 38.50,
      fees: 1.50,
      date: "2025-03-10",
    });
    txList.push({
      account: "PEA",
      ticker: "PAASI.PA",
      type: "VENTE",
      quantity: 5,
      unitPrice: 41.00,
      fees: 1.50,
      date: "2025-11-20",
    });
    txList.push({
      account: "PEA",
      ticker: "AIR.PA",
      type: "ACHAT",
      quantity: 5,
      unitPrice: 130.00,
      fees: 2.50,
      date: "2025-06-12",
    });

    // 5. Insert all transactions into DB
    let insertedCount = 0;
    for (const tx of txList) {
      const assetId = assetIdMap.get(tx.ticker);
      const accId = tx.account === "PEA" ? peaAccountId : ctoAccountId;
      if (!assetId || !accId) continue;

      await ctx.db.insert("transactions", {
        userId,
        accountId: accId,
        assetId,
        type: tx.type,
        quantity: tx.quantity,
        unitPrice: tx.unitPrice,
        fees: tx.fees,
        date: tx.date,
        createdAt: Date.now(),
      });
      insertedCount++;
    }

    return {
      userId,
      peaAccountId,
      ctoAccountId,
      insertedTransactionsCount: insertedCount,
    };
  },
});
