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

// Definition for a fallacy
export interface Fallacy {
  name: string;
  explanation: string;
}

// Definition for critical evaluation
export interface CriticalEvaluation {
  weaknesses: string[];
  assumptions: string[];
  strength: string;
}

// AI Analysis result format
export interface AnalysisResult {
  claim: string;
  premises: string[];
  emotions: EmotionScores;
  emotionJustification?: string;
  fallacies?: Fallacy[];
  structureMap?: string;
  criticalEvaluation?: CriticalEvaluation;
  counterArguments?: string[];
  modelName?: string; // To store specific model information (e.g., "GPT-4o")
}

// Type definitions
export type InsertAnalysisReport = z.infer<typeof insertAnalysisReportSchema>;
export type AnalysisReport = typeof analysisReports.$inferSelect;

// OpenRouter free model options
export const openRouterModels = [
  "deepseek/deepseek-v3-base:free",
  "google/gemini-2.5-pro-exp-03-25:free",
  "deepseek/deepseek-r1-zero:free",
  "openai/gpt-4o-mini"
] as const;

export type OpenRouterModel = typeof openRouterModels[number];

// Schema for the analysis request
export const analysisRequestSchema = z.object({
  text: z.string().min(1, "Argument text is required"),
  model: z.enum(["openai", "deepseek", "gemini", "openrouter"]),
  openRouterModel: z.enum(openRouterModels).optional()
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;
