import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createAccount = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("PEA"), v.literal("CTO")),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non autorisé. Veuillez vous connecter.");
    }

    const accountId = await ctx.db.insert("accounts", {
      userId,
      name: args.name.trim(),
      type: args.type,
      createdAt: Date.now(),
    });

    return accountId;
  },
});

export const getAccounts = query({
  args: {},
  handler: async (ctx: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("accounts")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();
  },
});

export const deleteAccount = mutation({
  args: {
    id: v.id("accounts"),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non autorisé.");
    }

    const account = await ctx.db.get(args.id);
    if (!account || account.userId !== userId) {
      throw new Error("Compte non trouvé.");
    }

    await ctx.db.delete(args.id);
  },
});
