import { pgTable, text, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workoutSessionsTable = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  planData: text("plan_data"),
  status: text("status").notNull().default("planned"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  totalReps: integer("total_reps").default(0),
  totalSets: integer("total_sets").default(0),
  durationMinutes: integer("duration_minutes").default(0),
  caloriesBurned: integer("calories_burned").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkoutSessionSchema = createInsertSchema(workoutSessionsTable).omit({ id: true, createdAt: true });
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
export type WorkoutSession = typeof workoutSessionsTable.$inferSelect;
