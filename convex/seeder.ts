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
      userId = await getAuthUserId(ctx);
    }
    if (!userId) {
      userId = "kd7b4j9ewva0h2sxke2tk2h3718c2pt0";
    }

    // 1. Get or create PEA account for user
    const existingAccounts = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();

    let accountId = existingAccounts.find((a: any) => a.type === "PEA")?._id;
    if (!accountId) {
      accountId = await ctx.db.insert("accounts", {
        userId,
        name: "PEA BoursoBank",
        type: "PEA",
        createdAt: Date.now(),
      });
    }

    // 2. Define assets from avis d'opéré
    const assetsData = [
      {
        ticker: "PUST.PA",
        isin: "FR0011871110",
        name: "AMUN.PEA NASDAQ-100 UC.ETF ACC",
        type: "ETF" as const,
        currentPrice: 103.18,
      },
      {
        ticker: "WPEA.PA",
        isin: "IE0002XZSHO1",
        name: "iShares MSCI World Swap PEA UCITS ETF",
        type: "ETF" as const,
        currentPrice: 6.8005,
      },
      {
        ticker: "PAASI.PA",
        isin: "FR0013412012",
        name: "Amundi PEA Asie Émergente MSCI UCITS ETF",
        type: "ETF" as const,
        currentPrice: 40.699,
      },
      {
        ticker: "C081.PA",
        isin: "LU1834983550",
        name: "Amundi Stoxx Europe 600 Basic Resources UCITS ETF",
        type: "ETF" as const,
        currentPrice: 145.70,
      },
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

    // 3. Delete existing transactions for this user & account to prevent duplicates during re-seeding
    const existingTxs = await ctx.db
      .query("transactions")
      .withIndex("by_account", (q: any) => q.eq("accountId", accountId))
      .collect();

    for (const tx of existingTxs) {
      if (tx.userId === userId) {
        await ctx.db.delete(tx._id);
      }
    }

    // 4. Insert transactions extracted from PDFs
    const transactionsData = [
      {
        ticker: "WPEA.PA",
        type: "ACHAT" as const,
        quantity: 125,
        unitPrice: 6.3848,
        fees: 0.0,
        date: "2026-04-22",
      },
      {
        ticker: "PUUST.PA",
        type: "ACHAT" as const,
        quantity: 3,
        unitPrice: 91.29,
        fees: 1.37,
        date: "2026-04-22",
      },
      {
        ticker: "PUUST.PA",
        type: "ACHAT" as const,
        quantity: 3,
        unitPrice: 95.98,
        fees: 1.44,
        date: "2026-05-05",
      },
      {
        ticker: "WPEA.PA",
        type: "ACHAT" as const,
        quantity: 99,
        unitPrice: 6.481,
        fees: 0.0,
        date: "2026-05-05",
      },
      {
        ticker: "PUUST.PA",
        type: "ACHAT" as const,
        quantity: 5,
        unitPrice: 104.60,
        fees: 2.62,
        date: "2026-06-15",
      },
      {
        ticker: "WPEA.PA",
        type: "ACHAT" as const,
        quantity: 150,
        unitPrice: 6.8005,
        fees: 0.0,
        date: "2026-06-15",
      },
      {
        ticker: "C081.PA",
        type: "ACHAT" as const,
        quantity: 7,
        unitPrice: 145.70,
        fees: 5.10,
        date: "2026-06-15",
      },
      {
        ticker: "PAASI.PA",
        type: "ACHAT" as const,
        quantity: 10,
        unitPrice: 40.699,
        fees: 1.99,
        date: "2026-06-15",
      },
    ];

    const insertedTxs = [];
    for (const tx of transactionsData) {
      const assetId = assetIdMap.get(tx.ticker);
      if (!assetId) continue;

      const txId = await ctx.db.insert("transactions", {
        userId,
        accountId,
        assetId,
        type: tx.type,
        quantity: tx.quantity,
        unitPrice: tx.unitPrice,
        fees: tx.fees,
        date: tx.date,
        createdAt: Date.now(),
      });
      insertedTxs.push(txId);
    }

    return {
      userId,
      accountId,
      insertedTransactionsCount: insertedTxs.length,
    };
  },
});
