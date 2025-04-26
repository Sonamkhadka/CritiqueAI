import { NextRequest, NextResponse } from 'next/server';
import { analyzeArgumentWithAI } from '../server/aiService';
import { analysisRequestSchema } from '../shared/schema';
import { ZodError } from 'zod';

// Simple in-memory rate limiting for serverless functions
// Note: This is not as robust as the original implementation
// and will reset whenever the function cold starts
const ipMap = new Map<string, { count: number, lastReset: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = ipMap.get(ip);
  
  if (!record || now - record.lastReset > WINDOW_MS) {
    ipMap.set(ip, { count: 1, lastReset: now });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }
  
  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count += 1;
  ipMap.set(ip, record);
  return { allowed: true, remaining: MAX_REQUESTS - record.count };
}

export default async function handler(req: NextRequest) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const limitResult = checkRateLimit(ip);
    
    // Create headers for rate limiting
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', MAX_REQUESTS.toString());
    headers.set('X-RateLimit-Remaining', limitResult.remaining.toString());
    
    // If rate limit exceeded
    if (!limitResult.allowed) {
      headers.set('Retry-After', '60');
      return NextResponse.json(
        { message: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate the request body
    const validatedData = analysisRequestSchema.parse(body);
    const { text, model, openRouterModel } = validatedData;

    // Perform the analysis with the selected AI model
    const result = await analyzeArgumentWithAI(text, model, openRouterModel);

    // Return the analysis result
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("Error analyzing argument:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid request data: " + error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      const statusCode = error.message.includes("API key") ? 401 : 500;
      return NextResponse.json(
        { message: error.message },
        { status: statusCode }
      );
    }

    // Generic fallback error
    return NextResponse.json(
      { message: "An unexpected error occurred during analysis" },
      { status: 500 }
    );
  }
}
