import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    resolved: v.optional(v.boolean()),
    severity: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    let clashes;
    if (args.resolved !== undefined) {
      clashes = await ctx.db
        .query("clashes")
        .withIndex("by_resolved", (q) => q.eq("resolved", args.resolved!))
        .collect();
    } else {
      clashes = await ctx.db.query("clashes").collect();
    }

    if (args.severity) {
      clashes = clashes.filter((c) => c.severity === args.severity);
    }

    const populated = await Promise.all(
      clashes.map(async (clash) => {
        const event1 = await ctx.db.get(clash.eventId1);
        const event2 = await ctx.db.get(clash.eventId2);
        return { ...clash, event1, event2 };
      })
    );

    return populated;
  },
});

export const resolve = mutation({
  args: {
    clashId: v.id("clashes"),
    resolvedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.clashId, {
      resolved: true,
      resolvedBy: args.resolvedBy,
      resolvedAt: Date.now(),
    });
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const clashes = await ctx.db.query("clashes").collect();
    return clashes.filter((c) => c.involvedUsers.includes(args.userId));
  },
});
