import { boolean, integer, json, pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar(),
  subscriptionStatus: varchar({ length: 50 }).default('free'), // 'free', 'pro', 'trial'
  subscriptionPlan: varchar({ length: 50 }).default('basic'), // 'basic', 'pro'
  subscriptionEndDate: timestamp(), // For trial tracking
  stripeCustomerId: varchar({ length: 255 }), // Stripe customer ID
  stripeSubscriptionId: varchar({ length: 255 }), // Stripe subscription ID
});

export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar().notNull().unique(),
  name: varchar(),
  description: varchar(),
  
  noOfChapters: integer().notNull(),
  includeVideo: boolean().default(false),
  
  level: varchar().notNull(),
  category: varchar(),
  courseJson: json(),
  courseContent: json().default({}),
  courseImage: varchar(), // Dynamic course image URL from Unsplash
  userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
});

export const enrollCourseTable = pgTable("enrollCourses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar('cid').references(() => coursesTable.cid),
  userEmail: varchar('userEmail').references(() => usersTable.email),
  completedChapters: json(),
});

// Interview Tables
export const interviewsTable = pgTable("interviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  interview_id: varchar({ length: 255 }).notNull().unique(),
  jobPosition: varchar({ length: 255 }).notNull(),
  jobDescription: text(),
  duration: varchar({ length: 50 }),
  type: json(), // Array of interview types
  questionList: json(), // Generated questions
  createdBy: varchar('createdBy').references(() => usersTable.email).notNull(),
  createdAt: timestamp().defaultNow(),
});

export const interviewResultsTable = pgTable("interview_results", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  interview_id: varchar('interview_id').references(() => interviewsTable.interview_id).notNull(),
  fullname: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  conversation_transcript: json(),
  feedback: json(), // Ratings and recommendations
  completed_at: timestamp().defaultNow(),
});