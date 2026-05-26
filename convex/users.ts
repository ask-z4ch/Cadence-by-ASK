import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    role: v.optional(v.union(v.literal("student"), v.literal("faculty"), v.literal("admin"))),
  },
  handler: async (ctx, args) => {
    if (args.role) {
      return await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", args.role!))
        .collect();
    }
    return await ctx.db.query("users").collect();
  },
});

export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const update = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    department: v.optional(v.id("departments")),
    batch: v.optional(v.id("batches")),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...fields } = args;
    await ctx.db.patch(userId, fields);
  },
});
