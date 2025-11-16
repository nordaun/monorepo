import redis from "@repo/redis";

/**
 * ## Get Cache
 * @description Gets the stored cache assigned to the key param
 * @param key The unique key
 */
export const getCache = async (key: string): Promise<string | null> => {
  try {
    const existingCache = await redis.get(key);
    if (!existingCache) return null;
    return JSON.parse(existingCache);
  } catch (error) {
    console.error("Unable to get cache value for " + key, error);
    return null;
  }
};

/**
 * ## Set Cache
 * @description Adds a new object to the cache
 * @param key The unique key assigned to the cache
 * @param value The object to be cached
 * @param ttl The expiration time of the cache
 */
export const setCache = async (
  key: string,
  value: string,
  ttl?: number
): Promise<string | null> => {
  try {
    const existingCache = await getCache(key);
    if (existingCache) return existingCache;

    await redis.setEx(key, ttl ? ttl : 3600, JSON.stringify(value));
    return value;
  } catch (error) {
    console.error("Unable to set cache value for " + key, error);
    return null;
  }
};

/**
 * ## Clear cache
 * @description Clears the stored cache assigned to the key param
 * @param key The unique key assigned to the cache you want to delete
 */
export const clearCache = async (key: string): Promise<void | null> => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Unable to clear cache value for " + key, error);
    return null;
  }
};
