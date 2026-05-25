import { RedisClient } from "bun";

export const db = new RedisClient(process.env.DB_URL);
