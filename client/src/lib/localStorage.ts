import { AnalysisResult } from "@shared/schema";
import { HistoryItem } from "@/lib/types";
import { nanoid } from "nanoid";

const HISTORY_KEY = "critiqueHistory";
const MAX_HISTORY_ITEMS = 10;

/**
 * Save an analysis result to localStorage
 * 
 * @param inputText The original argument text
 * @param result The analysis result from the AI
 * @param aiModel The AI model used for analysis
 */
export function saveHistoryItem(
  inputText: string,
  result: AnalysisResult,
  aiModel: string
): void {
  try {
    // Get existing history items
    const existingItems = getHistoryItems();
    
    // Create new history item
    const newItem: HistoryItem = {
      id: nanoid(),
      inputText,
      result,
      aiModel,
      timestamp: new Date(),
    };
    
    // Add new item to the beginning of the array
    const updatedItems = [newItem, ...existingItems];
    
    // Limit to MAX_HISTORY_ITEMS
    const limitedItems = updatedItems.slice(0, MAX_HISTORY_ITEMS);
    
    // Save to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedItems));
  } catch (error) {
    console.error("Error saving to history:", error);
  }
}

/**
 * Get all history items from localStorage
 * 
 * @returns Array of history items, sorted by newest first
 */
export function getHistoryItems(): HistoryItem[] {
  try {
    const storedItems = localStorage.getItem(HISTORY_KEY);
    if (!storedItems) {
      return [];
    }
    
    const parsedItems = JSON.parse(storedItems);
    if (!Array.isArray(parsedItems)) {
      return [];
    }
    
    // Convert string dates back to Date objects
    return parsedItems.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error("Error retrieving history:", error);
    return [];
  }
}

/**
 * Remove a specific history item by ID
 * 
 * @param id The ID of the history item to remove
 */
export function removeHistoryItem(id: string): void {
  try {
    const items = getHistoryItems();
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedItems));
  } catch (error) {
    console.error("Error removing history item:", error);
  }
}

/**
 * Clear all history items from localStorage
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing history:", error);
  }
}
