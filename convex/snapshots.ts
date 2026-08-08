import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMonthlySnapshots = query({
  args: {},
  handler: async (ctx: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const snapshots = await ctx.db
      .query("monthly_snapshots")
      .withIndex("by_user_month", (q: any) => q.eq("userId", userId))
      .collect();

    return snapshots.sort((a: any, b: any) => a.yearMonth.localeCompare(b.yearMonth));
  },
});

export const updateSnapshotForMonth = mutation({
  args: {
    yearMonth: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non autorisé.");
    }

    const allTxs = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();

    const filteredTxs = allTxs
      .filter((t: any) => t.date.substring(0, 7) <= args.yearMonth)
      .sort((a: any, b: any) => a.date.localeCompare(b.date));

    let invested = 0;
    let valuation = 0;
    const qtyMap = new Map<string, number>();

    for (const t of filteredTxs) {
      const asset = await ctx.db.get(t.assetId);
      if (!asset) continue;

      const currentQty = qtyMap.get(t.assetId) || 0;
      if (t.type === "ACHAT") {
        invested += t.quantity * t.unitPrice + t.fees;
        qtyMap.set(t.assetId, currentQty + t.quantity);
      } else if (t.type === "VENTE") {
        invested = Math.max(0, invested - (t.quantity * t.unitPrice - t.fees));
        qtyMap.set(t.assetId, Math.max(0, currentQty - t.quantity));
      }
    }

    for (const [assetId, qty] of qtyMap.entries()) {
      const asset = await ctx.db.get(assetId as any);
      if (asset && qty > 0) {
        valuation += qty * asset.currentPrice;
      }
    }

    const gainAmount = valuation - invested;
    const gainPercent = invested > 0 ? (gainAmount / invested) * 100 : 0;

    const existing = await ctx.db
      .query("monthly_snapshots")
      .withIndex("by_user_month", (q: any) =>
        q.eq("userId", userId).eq("yearMonth", args.yearMonth)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        totalInvested: Math.round(invested * 100) / 100,
        totalValuation: Math.round(valuation * 100) / 100,
        totalGainAmount: Math.round(gainAmount * 100) / 100,
        totalGainPercent: Math.round(gainPercent * 100) / 100,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("monthly_snapshots", {
        userId,
        yearMonth: args.yearMonth,
        totalInvested: Math.round(invested * 100) / 100,
        totalValuation: Math.round(valuation * 100) / 100,
        totalGainAmount: Math.round(gainAmount * 100) / 100,
        totalGainPercent: Math.round(gainPercent * 100) / 100,
        updatedAt: Date.now(),
      });
    }
  },
});
