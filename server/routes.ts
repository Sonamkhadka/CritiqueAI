import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeArgumentWithAI } from "./aiService";
import { analysisRequestSchema } from "@shared/schema";
import { z, ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for analyzing an argument
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = analysisRequestSchema.parse(req.body);
      const { text, model } = validatedData;

      // Perform the analysis with the selected AI model
      const result = await analyzeArgumentWithAI(text, model);

      // Return the analysis result
      res.json(result);
    } catch (error) {
      console.error("Error analyzing argument:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid request data: " + error.message });
      }

      if (error instanceof Error) {
        const statusCode = error.message.includes("API key") ? 401 : 500;
        return res.status(statusCode).json({ message: error.message });
      }

      // Generic fallback error
      res.status(500).json({ message: "An unexpected error occurred during analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
