import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  accounts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.union(v.literal("PEA"), v.literal("CTO")),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  assets: defineTable({
    ticker: v.string(),
    isin: v.optional(v.string()),
    name: v.string(),
    type: v.union(v.literal("ETF"), v.literal("Action")),
    currentPrice: v.number(),
    updatedAt: v.number(),
  }).index("by_ticker", ["ticker"]),

  transactions: defineTable({
    userId: v.id("users"),
    accountId: v.id("accounts"),
    assetId: v.id("assets"),
    type: v.union(v.literal("ACHAT"), v.literal("VENTE"), v.literal("DIVIDENDE")),
    quantity: v.number(),
    unitPrice: v.number(),
    fees: v.number(),
    date: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_account", ["accountId"])
    .index("by_user_date", ["userId", "date"])
    .index("by_user_account", ["userId", "accountId"])
    .index("by_user_asset", ["userId", "assetId"]),

  asset_prices_history: defineTable({
    assetId: v.id("assets"),
    yearMonth: v.string(),
    closingPrice: v.number(),
    updatedAt: v.number(),
  }).index("by_asset_month", ["assetId", "yearMonth"]),
});
