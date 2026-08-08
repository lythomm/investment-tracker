import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export interface AssetHolding {
  assetId: string;
  ticker: string;
  name: string;
  type: "ETF" | "Action";
  totalQuantity: number;
  totalInvestedCost: number;
  pru: number;
  currentPrice: number;
  currentValuation: number;
  unrealizedGainAmount: number;
  unrealizedGainPercent: number;
  dividendsEarned: number;
}

export const getPortfolioSummary = query({
  args: {
    accountId: v.optional(v.id("accounts")),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        totalInvested: 0,
        totalValuation: 0,
        totalGainAmount: 0,
        totalGainPercent: 0,
        totalDividends: 0,
        holdings: [],
      };
    }

    let txs;
    if (args.accountId) {
      txs = await ctx.db
        .query("transactions")
        .withIndex("by_account", (q: any) => q.eq("accountId", args.accountId!))
        .collect();
      txs = txs.filter((t: any) => t.userId === userId);
    } else {
      txs = await ctx.db
        .query("transactions")
        .withIndex("by_user", (q: any) => q.eq("userId", userId))
        .collect();
    }

    txs.sort((a: any, b: any) => a.date.localeCompare(b.date));

    const holdingsMap = new Map<string, AssetHolding>();
    let grandTotalInvested = 0;
    let grandTotalValuation = 0;
    let grandTotalDividends = 0;

    for (const t of txs) {
      const asset = await ctx.db.get(t.assetId);
      if (!asset) continue;

      let holding = holdingsMap.get(t.assetId);
      if (!holding) {
        holding = {
          assetId: t.assetId,
          ticker: asset.ticker,
          name: asset.name,
          type: asset.type,
          totalQuantity: 0,
          totalInvestedCost: 0,
          pru: 0,
          currentPrice: asset.currentPrice,
          currentValuation: 0,
          unrealizedGainAmount: 0,
          unrealizedGainPercent: 0,
          dividendsEarned: 0,
        };
        holdingsMap.set(t.assetId, holding);
      }

      if (t.type === "ACHAT") {
        const cost = t.quantity * t.unitPrice + t.fees;
        holding.totalQuantity += t.quantity;
        holding.totalInvestedCost += cost;
        holding.pru = holding.totalQuantity > 0 ? holding.totalInvestedCost / holding.totalQuantity : 0;
        grandTotalInvested += cost;
      } else if (t.type === "VENTE") {
        const proceeds = t.quantity * t.unitPrice - t.fees;
        holding.totalQuantity = Math.max(0, holding.totalQuantity - t.quantity);
        holding.totalInvestedCost = Math.max(0, holding.totalInvestedCost - proceeds);
        holding.pru = holding.totalQuantity > 0 ? holding.totalInvestedCost / holding.totalQuantity : 0;
        grandTotalInvested = Math.max(0, grandTotalInvested - proceeds);
      } else if (t.type === "DIVIDENDE") {
        const divAmount = t.quantity * t.unitPrice;
        holding.dividendsEarned += divAmount;
        grandTotalDividends += divAmount;
      }
    }

    const holdings: AssetHolding[] = [];
    for (const holding of holdingsMap.values()) {
      if (holding.totalQuantity > 0 || holding.dividendsEarned > 0) {
        holding.currentValuation = holding.totalQuantity * holding.currentPrice;
        holding.unrealizedGainAmount = holding.currentValuation - holding.totalInvestedCost;
        holding.unrealizedGainPercent =
          holding.totalInvestedCost > 0
            ? (holding.unrealizedGainAmount / holding.totalInvestedCost) * 100
            : 0;

        grandTotalValuation += holding.currentValuation;
        holdings.push(holding);
      }
    }

    const grandTotalGainAmount = grandTotalValuation - grandTotalInvested;
    const grandTotalGainPercent =
      grandTotalInvested > 0 ? (grandTotalGainAmount / grandTotalInvested) * 100 : 0;

    return {
      totalInvested: Math.round(grandTotalInvested * 100) / 100,
      totalValuation: Math.round(grandTotalValuation * 100) / 100,
      totalGainAmount: Math.round(grandTotalGainAmount * 100) / 100,
      totalGainPercent: Math.round(grandTotalGainPercent * 100) / 100,
      totalDividends: Math.round(grandTotalDividends * 100) / 100,
      holdings,
    };
  },
});
