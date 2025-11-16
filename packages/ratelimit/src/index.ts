import redis from "@repo/redis";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  reset: string;
  ttl: number;
};

/**
 * ## Rate Limiter
 * @description The ratelimiter intended to stop malicious or spam requests
 * @param ip The ip of the request
 * @param limit The max amount of requests that can be sent in a duration
 * @param duration The duration in which the limiter applies
 * @returns The result of the limitation
 */
export default async function rateLimit(
  ip: string,
  limit: number,
  duration: number
): Promise<RateLimitResult> {
  const key = `rate-limit:${ip}`;

  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, duration);

  const ttl = await redis.ttl(key);
  const allowed = current <= limit;
  const remaining = Math.max(0, limit - current);

  return {
    allowed,
    remaining,
    reset: new Date(Date.now() + ttl * 1000).toISOString(),
    ttl: ttl < 0 ? duration : ttl,
  };
}
