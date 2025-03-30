import { AnalysisRequest, AnalysisResult } from "@shared/schema";
import { apiRequest } from "./queryClient";
import { saveHistoryItem } from "./localStorage";

/**
 * Sends an argument to the backend for analysis by the selected AI model
 * 
 * @param text - The argument text to analyze
 * @param model - The AI model to use (openai, deepseek, or gemini)
 * @returns The analysis result from the AI model
 */
export async function analyzeArgument(text: string, model: string): Promise<AnalysisResult> {
  try {
    const payload: AnalysisRequest = {
      text,
      model: model as "openai" | "deepseek" | "gemini",
    };

    const response = await apiRequest("POST", "/api/analyze", payload);
    const result = await response.json() as AnalysisResult;
    
    // Save the result to localStorage
    saveHistoryItem(text, result, model);
    
    return result;
  } catch (error) {
    console.error("Error analyzing argument:", error);
    
    if (error instanceof Response) {
      const errorText = await error.text();
      throw new Error(errorText || "Failed to analyze argument");
    }
    
    throw error;
  }
}
