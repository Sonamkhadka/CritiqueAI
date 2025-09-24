import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeArgumentWithAI } from "./aiService";
import { analysisRequestSchema } from "@shared/schema";
import { z, ZodError } from "zod";
import { globalRateLimiter } from "./rateLimiter";
import { getServerConfig, isValidOpenRouterModel } from "./config";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rate limiting middleware for the analyze endpoint
  const rateLimitMiddleware = (req: Request, res: Response, next: Function) => {
    // Get client IP (consider using req.ip in production)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ipAddress = Array.isArray(clientIp) ? clientIp[0] : clientIp as string;
    
    // Check rate limit
    const limitResult = globalRateLimiter.checkLimit(ipAddress);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', '5');
    res.setHeader('X-RateLimit-Remaining', String(limitResult.remaining));
    
    if (limitResult.resetTime) {
      res.setHeader('X-RateLimit-Reset', Math.floor(limitResult.resetTime.getTime() / 1000));
    }
    
    if (!limitResult.allowed) {
      return res.status(429).json({
        message: 'Rate limit exceeded. Please try again later.',
        resetTime: limitResult.resetTime
      });
    }
    
    next();
  };
  
  // Get configuration for frontend
  app.get("/api/config", (_req, res) => {
    try {
      const config = getServerConfig();
      res.json(config);
    } catch (error) {
      console.error("Error getting server config:", error);
      res.status(500).json({ message: "Failed to get configuration" });
    }
  });

  // Lightweight health/diagnostics (no secrets leaked)
  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      env: {
        OPENROUTER_API_KEY: Boolean(process.env.OPENROUTER_API_KEY),
        OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
        DEEPSEEK_API_KEY: Boolean(process.env.DEEPSEEK_API_KEY),
        GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY),
      },
    });
  });

  // API endpoint for analyzing an argument
  app.post("/api/analyze", rateLimitMiddleware, async (req, res) => {
    try {
      // Validate the request body
      const validatedData = analysisRequestSchema.parse(req.body);
      const { text, model, openRouterModel } = validatedData;

      // Additional validation for OpenRouter models
      if (model === "openrouter" && openRouterModel) {
        if (!isValidOpenRouterModel(openRouterModel)) {
          return res.status(400).json({
            message: `Invalid OpenRouter model: ${openRouterModel}. Please check your configuration.`
          });
        }
      }

      // Perform the analysis with the selected AI model
      const result = await analyzeArgumentWithAI(text, model, openRouterModel);

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
