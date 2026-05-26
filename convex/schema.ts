import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const roles = v.union(v.literal("student"), v.literal("faculty"), v.literal("admin"));
export const eventTypes = v.union(
  v.literal("exam"),
  v.literal("assignment"),
  v.literal("university_event"),
  v.literal("extracurricular"),
  v.literal("class")
);
export const clashSeverity = v.union(v.literal("low"), v.literal("medium"), v.literal("high"));
export const submissionStatus = v.union(
  v.literal("pending"),
  v.literal("submitted"),
  v.literal("graded"),
  v.literal("late")
);

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: roles,
    department: v.optional(v.id("departments")),
    batch: v.optional(v.id("batches")),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  departments: defineTable({
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    facultyIds: v.array(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_code", ["code"]),

  batches: defineTable({
    name: v.string(),
    year: v.number(),
    section: v.string(),
    departmentId: v.id("departments"),
    studentIds: v.array(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_department", ["departmentId"])
    .index("by_year_section", ["year", "section"]),

  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: eventTypes,
    date: v.number(),
    startTime: v.number(),
    endTime: v.number(),
    marksWeightage: v.optional(v.number()),
    createdBy: v.id("users"),
    departmentId: v.optional(v.id("departments")),
    batchIds: v.array(v.id("batches")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_type", ["type"])
    .index("by_creator", ["createdBy"])
    .index("by_department", ["departmentId"]),

  submissions: defineTable({
    eventId: v.id("events"),
    studentId: v.id("users"),
    fileUrl: v.optional(v.string()),
    submittedAt: v.number(),
    status: submissionStatus,
    marks: v.optional(v.number()),
    gradedBy: v.optional(v.id("users")),
    gradedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_student", ["studentId"])
    .index("by_event_student", ["eventId", "studentId"]),

  clashes: defineTable({
    eventId1: v.id("events"),
    eventId2: v.id("events"),
    description: v.string(),
    severity: clashSeverity,
    involvedUsers: v.array(v.id("users")),
    resolved: v.boolean(),
    resolvedBy: v.optional(v.id("users")),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_events", ["eventId1", "eventId2"])
    .index("by_severity", ["severity"])
    .index("by_resolved", ["resolved"]),

  notifications: defineTable({
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
    read: v.boolean(),
    priority: v.optional(v.number()),
    relatedEventId: v.optional(v.id("events")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"])
    .index("by_type", ["type"]),
});
