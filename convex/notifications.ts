import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const send = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("deadline"),
      v.literal("clash"),
      v.literal("broadcast"),
      v.literal("submission"),
      v.literal("schedule_change")
    ),
    priority: v.optional(v.number()),
    relatedEventId: v.optional(v.id("events")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: args.title,
      message: args.message,
      type: args.type,
      read: false,
      priority: args.priority,
      relatedEventId: args.relatedEventId,
      createdAt: Date.now(),
    });
  },
});

export const broadcast = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    userIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    for (const userId of args.userIds) {
      await ctx.db.insert("notifications", {
        userId,
        title: args.title,
        message: args.message,
        type: "broadcast",
        read: false,
        createdAt: now,
      });
    }
  },
});

export const listByUser = query({
  args: {
    userId: v.id("users"),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let notifications;
    if (args.unreadOnly) {
      notifications = await ctx.db
        .query("notifications")
        .withIndex("by_user_read", (q) =>
          q.eq("userId", args.userId).eq("read", false)
        )
        .collect();
    } else {
      notifications = await ctx.db
        .query("notifications")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();
    }
    return notifications.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
  },
});

export const markAllRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", args.userId).eq("read", false)
      )
      .collect();
    for (const n of unread) {
      await ctx.db.patch(n._id, { read: true });
    }
  },
});
