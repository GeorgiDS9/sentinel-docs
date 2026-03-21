import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;
let warnedMissingEnv = false;

function getRateLimiter(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Fail-open in production if env is missing, do not crash API routes.
  if (!redisUrl || !redisToken) {
    if (!warnedMissingEnv) {
      console.warn(
        "[Proxy] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN missing. Rate limiting disabled (fail-open).",
      );
      warnedMissingEnv = true;
    }
    return null;
  }

  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1h"),
    ephemeralCache: false,
    analytics: true,
    prefix: "@upstash/ratelimit",
  });

  return ratelimit;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}

export async function proxy(request: NextRequest) {
  // Keep E2E deterministic in CI
  if (process.env.CI === "true") {
    return NextResponse.next();
  }

  // Only protect expensive ingestion route
  if (request.nextUrl.pathname.startsWith("/api/rag/ingest")) {
    try {
      const limiter = getRateLimiter();

      // Missing env / initialization issue => fail-open, never block route.
      if (!limiter) return NextResponse.next();

      const ip = getClientIp(request);
      const { success, limit, reset, remaining } = await limiter.limit(ip);

      if (!success) {
        return NextResponse.json(
          {
            error:
              "Security Alert: Rate limit exceeded to protect system resources. Please try again in 1 hour.",
            limit,
            remaining,
            reset,
          },
          {
            status: 429,
            headers: {
              "x-ratelimit-limit": limit.toString(),
              "x-ratelimit-remaining": remaining.toString(),
              "x-ratelimit-reset": reset.toString(),
            },
          },
        );
      }
    } catch (error) {
      // Never break ingest/purge due to middleware/proxy failures.
      console.error("[Proxy] Rate limiter error. Failing open.", error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Run on rag API routes (ingest + purge). Ingest is selectively limited above.
export const config = {
  matcher: ["/api/rag/:path*"],
};
