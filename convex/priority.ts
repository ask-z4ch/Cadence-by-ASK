import { v } from "convex/values";
import { query } from "./_generated/server";

const TYPE_WEIGHTS: Record<string, number> = {
  exam: 10,
  assignment: 7,
  university_event: 5,
  class: 3,
  extracurricular: 1,
};

const ROLE_WEIGHTS: Record<string, number> = {
  student: 1,
  faculty: 1.2,
  admin: 1.5,
};

function calculatePriority(
  daysRemaining: number,
  eventType: string,
  marksWeightage?: number
): number {
  const days = Math.max(daysRemaining, 0.5);
  const typeWeight = TYPE_WEIGHTS[eventType] || 1;
  const marksWeight = marksWeightage ? marksWeightage / 100 : 1;
  return (1 / days) * typeWeight * marksWeight;
}

export const getPriorityFeed = query({
  args: {
    userId: v.id("users"),
    batchId: v.optional(v.id("batches")),
    departmentId: v.optional(v.id("departments")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return [];

    const now = Date.now();
    const allEvents = await ctx.db.query("events").collect();

    const relevantEvents = allEvents.filter((event) => {
      if (args.batchId && event.batchIds.includes(args.batchId)) return true;
      return false;
    });

    const scored = relevantEvents.map((event) => {
      const daysRemaining = (event.date - now) / (1000 * 60 * 60 * 24);
      const priority = calculatePriority(daysRemaining, event.type, event.marksWeightage);
      return { ...event, priority, daysRemaining: Math.round(daysRemaining * 10) / 10 };
    });

    const sorted = scored.sort((a, b) => b.priority - a.priority);

    return args.limit ? sorted.slice(0, args.limit) : sorted;
  },
});
