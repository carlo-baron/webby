import { createRateLimiterMiddleware } from '#root/middlewares/rateLimiter.js';

export const defaultLimiter = createRateLimiterMiddleware({
	keyPrefix: 'auth_default',
	points: 60,
	duration: 60
});

export const refreshLimiter = createRateLimiterMiddleware({
	keyPrefix: 'refresh',
	points: 60,
	duration: 60,
});

export const googleLimiter = createRateLimiterMiddleware({
	keyPrefix: 'google',
	points: 5,
	duration: 60 * 60,
	blockDuration: 60 * 60 * 3
});

export const loginLimiter = createRateLimiterMiddleware({
	keyPrefix: 'login_tries',
	points: 10,
	duration: 60
});

export const registerLimiter = createRateLimiterMiddleware({
	keyPrefix: 'register_tries',
	points: 10,
	duration: 60
});
