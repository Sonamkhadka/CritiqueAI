interface RateLimitRecord {
  count: number;
  lastReset: number;
}

/**
 * Simple in-memory rate limiter
 * Tracks requests by IP address and enforces limits
 */
export class RateLimiter {
  private ipMap: Map<string, RateLimitRecord>;
  private readonly windowMs: number;
  private readonly maxRequests: number;
  
  /**
   * Create a new rate limiter
   * @param windowMs Time window in milliseconds (default: 1 minute)
   * @param maxRequests Maximum requests allowed in the time window (default: 10)
   */
  constructor(windowMs = 60 * 1000, maxRequests = 5) {
    this.ipMap = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }
  
  /**
   * Check if a request is allowed
   * @param ip IP address of the requester
   * @returns Object with allowed status and remaining attempts
   */
  checkLimit(ip: string): { allowed: boolean; remaining: number; resetTime: Date | null } {
    const now = Date.now();
    const record = this.ipMap.get(ip);
    
    // If no record exists or window has passed, create/reset record
    if (!record || now - record.lastReset > this.windowMs) {
      this.ipMap.set(ip, { count: 1, lastReset: now });
      return { 
        allowed: true, 
        remaining: this.maxRequests - 1,
        resetTime: new Date(now + this.windowMs)
      };
    }
    
    // Check if limit is reached
    if (record.count >= this.maxRequests) {
      const resetTime = new Date(record.lastReset + this.windowMs);
      return { 
        allowed: false, 
        remaining: 0,
        resetTime
      };
    }
    
    // Increment counter and allow request
    record.count += 1;
    this.ipMap.set(ip, record);
    
    return { 
      allowed: true, 
      remaining: this.maxRequests - record.count,
      resetTime: new Date(record.lastReset + this.windowMs)
    };
  }
  
  /**
   * Clean up old records to prevent memory leaks
   */
  cleanUp(): void {
    const now = Date.now();
    // Avoiding iterators by using forEach which works in all environments
    this.ipMap.forEach((record, ip) => {
      if (now - record.lastReset > this.windowMs) {
        this.ipMap.delete(ip);
      }
    });
  }
}

// Create and export a singleton instance for use throughout the app
export const globalRateLimiter = new RateLimiter();

// Run cleanup periodically (e.g., every 5 minutes)
setInterval(() => {
  globalRateLimiter.cleanUp();
}, 5 * 60 * 1000);