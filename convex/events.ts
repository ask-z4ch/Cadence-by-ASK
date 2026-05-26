import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("exam"),
      v.literal("assignment"),
      v.literal("university_event"),
      v.literal("extracurricular"),
      v.literal("class")
    ),
    date: v.number(),
    startTime: v.number(),
    endTime: v.number(),
    marksWeightage: v.optional(v.number()),
    createdBy: v.id("users"),
    departmentId: v.optional(v.id("departments")),
    batchIds: v.array(v.id("batches")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const eventId = await ctx.db.insert("events", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    const clashes = await detectClashes(ctx, args.date, args.startTime, args.endTime, args.batchIds);
    for (const clash of clashes) {
      await ctx.db.insert("clashes", {
        eventId1: eventId,
        eventId2: clash._id,
        description: `"${args.title}" clashes with "${clash.title}"`,
        severity: "medium",
        involvedUsers: [],
        resolved: false,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { eventId, clashesFound: clashes.length };
  },
});

async function detectClashes(
  ctx: any,
  date: number,
  startTime: number,
  endTime: number,
  batchIds: any[]
) {
  const dayEvents = await ctx.db
    .query("events")
    .withIndex("by_date", (q: any) => q.eq("date", date))
    .collect();

  return dayEvents.filter((event: any) => {
    const hasOverlap = startTime < event.endTime && endTime > event.startTime;
    const sharesBatch = event.batchIds.some((b: any) => batchIds.includes(b));
    return hasOverlap && sharesBatch;
  });
}

export const list = query({
  args: {
    departmentId: v.optional(v.id("departments")),
    batchId: v.optional(v.id("batches")),
    type: v.optional(
      v.union(
        v.literal("exam"),
        v.literal("assignment"),
        v.literal("university_event"),
        v.literal("extracurricular"),
        v.literal("class")
      )
    ),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db.query("events").collect();

    if (args.departmentId) {
      events = events.filter((e) => e.departmentId === args.departmentId);
    }
    if (args.batchId) {
      events = events.filter((e) => args.batchId && e.batchIds.includes(args.batchId));
    }
    if (args.type) {
      events = events.filter((e) => e.type === args.type);
    }
    if (args.startDate) {
      events = events.filter((e) => e.date >= args.startDate!);
    }
    if (args.endDate) {
      events = events.filter((e) => e.date <= args.endDate!);
    }

    return events.sort((a, b) => a.date - b.date);
  },
});

export const getById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.eventId);
  },
});

export const remove = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.eventId);
  },
});

export const update = mutation({
  args: {
    eventId: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.number()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    marksWeightage: v.optional(v.number()),
    batchIds: v.optional(v.array(v.id("batches"))),
  },
  handler: async (ctx, args) => {
    const { eventId, ...fields } = args;
    await ctx.db.patch(eventId, { ...fields, updatedAt: Date.now() });
  },
});
