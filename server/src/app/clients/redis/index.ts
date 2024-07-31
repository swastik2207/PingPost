import { Redis } from "ioredis";

export const redisClient =   new Redis({
    host: 'golden-halibut-58238.upstash.io',
    port: 6379,
    password: 'AeN-AAIjcDFiNGFiZTU4ZmViMmM0ZTczODRkMzUzNDhmMmQ5YWIzZnAxMA',
    tls: {}  // Use this if your Redis Cloud instance requires SSL/TLS.
  });



