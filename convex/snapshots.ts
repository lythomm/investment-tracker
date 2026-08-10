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

    // Always compute dynamically from transactions
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

    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const firstYM = txs[0].date.substring(0, 7);

    const [startYear, startMonth] = firstYM.split("-").map(Number);
    const [endYear, endMonth] = currentYM.split("-").map(Number);

    const yearMonths: string[] = [];
    let curY = startYear;
    let curM = startMonth;
    while (curY < endYear || (curY === endYear && curM <= endMonth)) {
      yearMonths.push(`${curY}-${String(curM).padStart(2, "0")}`);
      curM++;
      if (curM > 12) {
        curM = 1;
        curY++;
      }
    }

    // Prepend previous month as 0 EUR baseline if needed
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


