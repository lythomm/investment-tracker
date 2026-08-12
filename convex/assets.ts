import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAssets = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("assets").collect();
  },
});

export const getOrCreateAsset = mutation({
  args: {
    ticker: v.string(),
    name: v.string(),
    isin: v.optional(v.string()),
    type: v.union(
      v.literal("ETF"),
      v.literal("Action"),
      v.literal("Crypto"),
      v.literal("SCPI")
    ),
    currentPrice: v.number(),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non autorisé.");
    }

    const cleanTicker = args.ticker.trim().toUpperCase();
    const existing = await ctx.db
      .query("assets")
      .withIndex("by_ticker", (q: any) => q.eq("ticker", cleanTicker))
      .unique();

    if (existing) {
      if (args.isin && !existing.isin) {
        await ctx.db.patch(existing._id, {
          isin: args.isin.trim().toUpperCase(),
        });
      }
      return existing._id;
    }

    return await ctx.db.insert("assets", {
      ticker: cleanTicker,
      name: args.name.trim(),
      isin: args.isin ? args.isin.trim().toUpperCase() : undefined,
      type: args.type,
      currentPrice: args.currentPrice,
      updatedAt: Date.now(),
    });
  },
});

export const updateAssetPrices = mutation({
  args: {
    updates: v.array(
      v.object({
        assetId: v.id("assets"),
        currentPrice: v.number(),
      })
    ),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non autorisé.");
    }

    const now = Date.now();
    for (const update of args.updates) {
      if (update.currentPrice > 0) {
        await ctx.db.patch(update.assetId, {
          currentPrice: update.currentPrice,
          updatedAt: now,
        });
      }
    }
  },
});

export const upsertAssetPriceHistory = mutation({
  args: {
    assetId: v.id("assets"),
    history: v.array(
      v.object({
        yearMonth: v.string(),
        closingPrice: v.number(),
      })
    ),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non autorisé.");
    }

    const now = Date.now();
    for (const item of args.history) {
      if (item.closingPrice <= 0) continue;

      const existing = await ctx.db
        .query("asset_prices_history")
        .withIndex("by_asset_month", (q: any) =>
          q.eq("assetId", args.assetId).eq("yearMonth", item.yearMonth)
        )
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          closingPrice: item.closingPrice,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("asset_prices_history", {
          assetId: args.assetId,
          yearMonth: item.yearMonth,
          closingPrice: item.closingPrice,
          updatedAt: now,
        });
      }
    }
  },
});
