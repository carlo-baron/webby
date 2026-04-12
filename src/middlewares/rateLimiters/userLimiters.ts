import { createRateLimiterMiddleware } from '#root/middlewares/rateLimiter.js';

export const getAllUsersLimiter = createRateLimiterMiddleware({
	keyPrefix: 'get_users_all',
	points: 20,
	duration: 60
});

export const getMeLimiter = createRateLimiterMiddleware({
	keyPrefix: 'get_user_me',
	points: 120,
	duration: 60
});

export const getUserLimiter = createRateLimiterMiddleware({
	keyPrefix: 'get_user',
	points: 60,
	duration: 60
});

export const patchUserLimiter = createRateLimiterMiddleware({
	keyPrefix: 'patch_user',
	points: 10,
	duration: 60,
	blockDuration: 60 * 3
});

export const deleteUserLimiter = createRateLimiterMiddleware({
	keyPrefix: 'delete_user',
	points: 5,
	duration: 60,
	blockDuration: 60 * 3
})
