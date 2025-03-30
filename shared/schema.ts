import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define the structure for an analysis report
export const analysisReports = pgTable("analysis_reports", {
  id: serial("id").primaryKey(),
  inputText: text("input_text").notNull(),
  claim: text("claim").notNull(),
  premises: text("premises").array().notNull(),
  emotions: jsonb("emotions").notNull(), // Store the emotion scores as JSON
  aiModel: text("ai_model").notNull(), // Which AI model was used
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Schema for creating a new analysis report
export const insertAnalysisReportSchema = createInsertSchema(analysisReports).pick({
  inputText: true,
  claim: true,
  premises: true,
  emotions: true,
  aiModel: true
});

// Emotion scores interface
export interface EmotionScores {
  Anger: number;
  Sadness: number;
  Joy: number;
  Fear: number;
  Surprise: number;
}

// AI Analysis result format
export interface AnalysisResult {
  claim: string;
  premises: string[];
  emotions: EmotionScores;
}

// Type definitions
export type InsertAnalysisReport = z.infer<typeof insertAnalysisReportSchema>;
export type AnalysisReport = typeof analysisReports.$inferSelect;

// Schema for the analysis request
export const analysisRequestSchema = z.object({
  text: z.string().min(1, "Argument text is required"),
  model: z.enum(["openai", "deepseek", "gemini"])
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;
