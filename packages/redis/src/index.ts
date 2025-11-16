import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

const redisClientSingleton = () => {
  return createClient({
    url: process.env.REDIS_URL,
  });
};

declare const globalThis: {
  redisGlobal: RedisClient;
} & typeof global;

/**
 * ## Redis Client
 * @description The Redis Client that is used for caching and ratelimiting
 */
const redis: RedisClient = globalThis.redisGlobal ?? redisClientSingleton();

if (!redis.isOpen) {
  await redis.connect();
}

export default redis;

if (process.env.NODE_ENV === "development") globalThis.redisGlobal = redis;
