import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submit = mutation({
  args: {
    eventId: v.id("events"),
    studentId: v.id("users"),
    fileUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("submissions")
      .withIndex("by_event_student", (q) =>
        q.eq("eventId", args.eventId).eq("studentId", args.studentId)
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        fileUrl: args.fileUrl,
        submittedAt: now,
        status: "submitted",
      });
      return existing._id;
    }

    const submissionId = await ctx.db.insert("submissions", {
      eventId: args.eventId,
      studentId: args.studentId,
      fileUrl: args.fileUrl,
      submittedAt: now,
      status: "submitted",
      createdAt: now,
    });

    return submissionId;
  },
});

export const listByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
  },
});

export const listByStudent = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});

export const grade = mutation({
  args: {
    submissionId: v.id("submissions"),
    marks: v.number(),
    gradedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, {
      marks: args.marks,
      gradedBy: args.gradedBy,
      gradedAt: Date.now(),
      status: "graded",
    });
  },
});
