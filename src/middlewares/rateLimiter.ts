import { redisClient } from '#root/config/redis.js';
import { RateLimiterRedis, type IRateLimiterRedisOptions } from 'rate-limiter-flexible';
import { tooMany } from '#root/lib/errorHelper.js';
import type { AuthRequest } from '#root/types/userTypes.js';
import type { 
  Request,
  Response,
  NextFunction 
} from "express";

export function createRateLimiterMiddleware(
  opts: Omit<IRateLimiterRedisOptions, "storeClient">
) {
  const limiter = new RateLimiterRedis({
		...opts,
		storeClient: redisClient,
		tableName: 'rlflx'
	});
  return async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
		const key = authReq.user?.name || req.ip;
    try {
      await limiter.consume(`${key}:rl`);
      next();
    } catch (rlRes: any) {
      res.set('Retry-After', String(Math.ceil(rlRes.msBeforeNext / 1000)));
      next(tooMany());
    }
  };
}
