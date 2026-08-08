import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addTransaction = mutation({
  args: {
    accountId: v.id("accounts"),
    assetId: v.id("assets"),
    type: v.union(v.literal("ACHAT"), v.literal("VENTE"), v.literal("DIVIDENDE")),
    quantity: v.number(),
    unitPrice: v.number(),
    fees: v.number(),
    date: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non autorisé.");
    }

    const account = await ctx.db.get(args.accountId);
    if (!account || account.userId !== userId) {
      throw new Error("Compte non trouvé ou non autorisé.");
    }

    return await ctx.db.insert("transactions", {
      userId,
      accountId: args.accountId,
      assetId: args.assetId,
      type: args.type,
      quantity: Math.abs(args.quantity),
      unitPrice: Math.abs(args.unitPrice),
      fees: Math.abs(args.fees),
      date: args.date,
      createdAt: Date.now(),
    });
  },
});

export const addBatchTransactions = mutation({
  args: {
    items: v.array(
      v.object({
        accountId: v.id("accounts"),
        assetId: v.id("assets"),
        type: v.union(v.literal("ACHAT"), v.literal("VENTE"), v.literal("DIVIDENDE")),
        quantity: v.number(),
        unitPrice: v.number(),
        fees: v.number(),
        date: v.string(),
      })
    ),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non autorisé.");
    }

    const insertedIds = [];
    for (const item of args.items) {
      const account = await ctx.db.get(item.accountId);
      if (!account || account.userId !== userId) {
        throw new Error("Compte non trouvé.");
      }

      const id = await ctx.db.insert("transactions", {
        userId,
        accountId: item.accountId,
        assetId: item.assetId,
        type: item.type,
        quantity: Math.abs(item.quantity),
        unitPrice: Math.abs(item.unitPrice),
        fees: Math.abs(item.fees),
        date: item.date,
        createdAt: Date.now(),
      });
      insertedIds.push(id);
    }

    return insertedIds;
  },
});

export const getTransactions = query({
  args: {
    accountId: v.optional(v.union(v.null(), v.id("accounts"))),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
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

    const result = [];
    for (const t of txs) {
      const asset = await ctx.db.get(t.assetId);
      const account = await ctx.db.get(t.accountId);
      result.push({
        ...t,
        asset,
        account,
      });
    }

    return result.sort((a: any, b: any) => b.date.localeCompare(a.date));
  },
});

export const deleteTransaction = mutation({
  args: {
    id: v.id("transactions"),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non autorisé.");
    }

    const tx = await ctx.db.get(args.id);
    if (!tx || tx.userId !== userId) {
      throw new Error("Transaction non trouvée ou non autorisée.");
    }

    await ctx.db.delete(args.id);
  },
});
