import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '#root/config/redis.js';

export function getRateLimiter(
    maxAttempts: number, 
    duration: number, 
    blockDuration?: number
){
    
    const opts = {
        storeClient: redisClient,
				tableName: 'rlflx',
        points: maxAttempts,
        duration: duration,
        blockDuration: blockDuration || 0,
    }
    return new RateLimiterRedis(opts);
}
