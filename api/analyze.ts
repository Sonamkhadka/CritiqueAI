import type { IncomingMessage, ServerResponse } from 'http';
import { analyzeArgumentWithAI } from '../server/aiService';
import { analysisRequestSchema } from '../shared/schema';
import { ZodError } from 'zod';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => void;
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ipHeader = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    const ip = ipHeader ?? req.socket?.remoteAddress ?? 'unknown';

    const limitResult = checkRateLimit(ip);

    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', limitResult.remaining.toString());

    if (!limitResult.allowed) {
      res.setHeader('Retry-After', '60');
      res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' });
      return;
    }

    const bodyInput = (req.body ?? (req as unknown as { rawBody?: unknown }).rawBody) as unknown;
    const parsedBody = await parseBody(bodyInput, req);

    const validatedData = analysisRequestSchema.parse(parsedBody);
    const { text, model, openRouterModel } = validatedData;

    const result = await analyzeArgumentWithAI(text, model, openRouterModel);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error analyzing argument:', error);

    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Invalid request data: ' + error.message });
      return;
    }

    if (error instanceof SyntaxError) {
      res.status(400).json({ message: 'Invalid JSON body' });
      return;
    }

    if (error instanceof Error) {
      const statusCode = error.message.includes('API key') ? 401 : 500;
      res.status(statusCode).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'An unexpected error occurred during analysis' });
  }
}

async function parseBody(bodyInput: unknown, req: IncomingMessage): Promise<unknown> {
  if (typeof bodyInput === 'string') {
    return JSON.parse(bodyInput);
  }

  if (bodyInput instanceof Buffer) {
    return JSON.parse(bodyInput.toString('utf8'));
  }

  if (bodyInput != null) {
    return bodyInput;
  }

  const chunks: Uint8Array[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  if (chunks.length === 0) {
    return undefined;
  }

  const combined = Buffer.concat(chunks);
  if (!combined.length) {
    return undefined;
  }

  return JSON.parse(combined.toString('utf8'));
}
