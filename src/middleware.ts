import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// 🛡️ Initialize the Redis Bouncer
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error(
    "🛡️ INFRASTRUCTURE ERROR: Redis credentials missing. Check your environment variables."
  );
}

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

// 🛡️ Define the "Economic Guard" Policy: 10 uploads per hour
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, "1h"),
  ephemeralCache: false, 
  analytics: true,
  prefix: "@upstash/ratelimit",
})

export async function middleware(request: NextRequest) {
  // 🔒 THE GATEKEEPER: Only protect the expensive /api/rag/ingest route
  if (request.nextUrl.pathname.startsWith('/api/rag/ingest')) {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(',')[0] : "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)

    if (!success) {
      return NextResponse.json(
        { 
          error: "Security Alert: Rate limit exceeded to protect system resources. Please try again in 1 hour.",
          limit,
          remaining,
          reset
        }, 
        { 
          status: 429, // Too Many Requests
          headers: {
            'x-ratelimit-limit': limit.toString(),
            'x-ratelimit-remaining': remaining.toString(),
            'x-ratelimit-reset': reset.toString(),
          }
        }
      )
    }
  }

  return NextResponse.next()
}

// 🛡️ PERFORMANCE: Only run this on API routes to save execution time
export const config = {
  matcher: ['/api/rag/:path*'],
}