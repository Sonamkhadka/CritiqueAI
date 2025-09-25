import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
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
export const insertAnalysisReportSchema = z.object({
  inputText: z.string(),
  claim: z.string(),
  premises: z.array(z.string()),
  emotions: z.any(),
  aiModel: z.string(),
});

// Emotion scores interface - make optional with defaults
export interface EmotionScores {
  Anger?: number;
  Sadness?: number;
  Joy?: number;
  Fear?: number;
  Surprise?: number;
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

// OpenRouter free model options - configurable via environment
const defaultModels = [
  "mistralai/mistral-7b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemini-2.5-pro-exp-03-25:free",
  "deepseek/deepseek-r1-zero:free",
  "openai/gpt-4o-mini"
] as const;

// Get models from environment or use defaults
const getOpenRouterModels = () => {
  if (typeof process !== 'undefined' && process.env?.OPENROUTER_MODELS) {
    return process.env.OPENROUTER_MODELS.split(',').map(m => m.trim()) as readonly string[];
  }
  return defaultModels;
};

export const openRouterModels = getOpenRouterModels();

export type OpenRouterModel = typeof openRouterModels[number];

// Schema for the analysis request - make openRouterModel flexible
export const analysisRequestSchema = z.object({
  text: z.string().min(1, "Argument text is required"),
  model: z.enum(["openai", "deepseek", "gemini", "openrouter"]),
  openRouterModel: z.string().optional() // Allow any string instead of enum
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;
