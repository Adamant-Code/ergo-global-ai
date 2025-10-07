import "dotenv/config";
import debugLib from "debug";
import { createClient } from "redis";

const debug = debugLib("server/config:redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) =>
  debug("❌ Redis connection error:", err)
);

// Connect on startup
(async () => {
  try {
    await redisClient.connect();
    debug("Redis connected");
  } catch (err) {
    debug("Redis connection failed:", err);
  }
})();

export default redisClient;
export type RedisClientTypeInstance = typeof redisClient;