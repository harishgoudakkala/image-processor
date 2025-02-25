import Redis from "ioredis"

const redis = new Redis({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: true,
    connectTimeout: 30000,
  },
  maxRetriesPerRequest: null,
  password: process.env.REDIS_PASSWORD,
});

redis.on("connect", () => {
    console.log( "Connected to Redis");
  });
  
  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });
  

export default redis