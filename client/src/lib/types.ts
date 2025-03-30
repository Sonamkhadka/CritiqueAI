import { AnalysisResult } from "@shared/schema";

/**
 * Represents a history item for an analyzed argument
 */
export interface HistoryItem {
  id: string;
  inputText: string;
  result: AnalysisResult;
  aiModel: string;
  timestamp: Date;
}