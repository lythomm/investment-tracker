import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMonthlySnapshots = query({
  args: {
    accountId: v.optional(v.union(v.null(), v.id("accounts"))),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // If no account filter, check existing monthly_snapshots table first
    if (!args.accountId) {
      const dbSnapshots = await ctx.db
        .query("monthly_snapshots")
        .withIndex("by_user_month", (q: any) => q.eq("userId", userId))
        .collect();

      if (dbSnapshots.length > 0) {
        return dbSnapshots.sort((a: any, b: any) => a.yearMonth.localeCompare(b.yearMonth));
      }
    }

    // Compute dynamically from transactions if filtered by accountId or no snapshots exist
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

    if (txs.length === 0) {
      return [];
    }

    txs.sort((a: any, b: any) => a.date.localeCompare(b.date));

    const yearMonthsSet = new Set<string>();
    for (const t of txs) {
      if (t.date && t.date.length >= 7) {
        yearMonthsSet.add(t.date.substring(0, 7));
      }
    }

    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    yearMonthsSet.add(currentYM);

    const yearMonths = Array.from(yearMonthsSet).sort();

    // If only 1 month exists, prepend previous month as 0 EUR baseline so a line can be drawn
    if (yearMonths.length === 1) {
      const [y, m] = yearMonths[0].split("-").map(Number);
      const prevDate = new Date(y, m - 2, 1);
      const prevYM = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
      yearMonths.unshift(prevYM);
    }

    const assetIds = Array.from(new Set<string>(txs.map((t: any) => String(t.assetId))));
    const assetMap = new Map<string, any>();
    const priceHistoryMap = new Map<string, number>();

    for (const id of assetIds) {
      const asset = await ctx.db.get(id as any);
      if (asset) assetMap.set(id as string, asset);

      const historyRows = await ctx.db
        .query("asset_prices_history")
        .withIndex("by_asset_month", (q: any) => q.eq("assetId", id as any))
        .collect();
      for (const row of historyRows) {
        priceHistoryMap.set(`${id}_${row.yearMonth}`, row.closingPrice);
      }
    }

    const result: Array<{
      yearMonth: string;
      totalInvested: number;
      totalValuation: number;
      totalGainAmount: number;
    }> = [];

    for (const ym of yearMonths) {
      const txsUpToMonth = txs.filter((t: any) => t.date.substring(0, 7) <= ym);
      let invested = 0;
      const qtyMap = new Map<string, number>();

      for (const t of txsUpToMonth) {
        const key = String(t.assetId);
        const currentQty = qtyMap.get(key) || 0;
        if (t.type === "ACHAT") {
          invested += t.quantity * t.unitPrice + t.fees;
          qtyMap.set(key, currentQty + t.quantity);
        } else if (t.type === "VENTE") {
          invested = Math.max(0, invested - (t.quantity * t.unitPrice - t.fees));
          qtyMap.set(key, Math.max(0, currentQty - t.quantity));
        }
      }

      let valuation = 0;
      for (const [assetId, qty] of qtyMap.entries()) {
        const asset = assetMap.get(assetId);
        if (asset && qty > 0) {
          const histPrice = priceHistoryMap.get(`${assetId}_${ym}`);
          const priceToUse = typeof histPrice === "number" && histPrice > 0 ? histPrice : asset.currentPrice;
          valuation += qty * priceToUse;
        }
      }

      const gainAmount = valuation - invested;
      result.push({
        yearMonth: ym,
        totalInvested: Math.round(invested * 100) / 100,
        totalValuation: Math.round(valuation * 100) / 100,
        totalGainAmount: Math.round(gainAmount * 100) / 100,
      });
    }

    return result;
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
