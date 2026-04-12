import { Redis } from "ioredis";
import { appMode } from "./appMode.js";

const uri = appMode === 
	"production" ? 
		process.env.REDIS_URL!
			: 
		'redis://localhost:6379';

export const redisClient = new Redis(uri);
