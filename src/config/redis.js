import Redis from "ioredis"

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    connectTimeout:30000
});

redis.on("connect", () => {
    console.log( "Connected to Redis");
  });
  
  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });
  

export default redis