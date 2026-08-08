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
    type: v.union(v.literal("ETF"), v.literal("Action")),
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
