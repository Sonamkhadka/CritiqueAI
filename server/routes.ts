import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeArgumentWithAI } from "./aiService";
import { analysisRequestSchema } from "@shared/schema";
import { z, ZodError } from "zod";
import { globalRateLimiter } from "./rateLimiter";

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
  
  // API endpoint for analyzing an argument
  app.post("/api/analyze", rateLimitMiddleware, async (req, res) => {
    try {
      // Validate the request body
      const validatedData = analysisRequestSchema.parse(req.body);
      const { text, model, openRouterModel } = validatedData;

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
