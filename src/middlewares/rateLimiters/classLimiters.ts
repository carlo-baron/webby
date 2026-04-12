import { createRateLimiterMiddleware } from '#root/middlewares/rateLimiter.js';

export const getAllClassLimiter = createRateLimiterMiddleware({
	keyPrefix: 'get_class_all',
	points: 20,
	duration: 60
});

export const getMyClassesLimiter = createRateLimiterMiddleware({
	keyPrefix: 'get_class_me_all',
	points: 60,
	duration: 60
});

export const getMyClassLimiter = createRateLimiterMiddleware({
	keyPrefix: 'get_class_me',
	points: 120,
	duration: 60
});

export const makeClassLimiter = createRateLimiterMiddleware({
	keyPrefix: 'create_class',
	points: 50,
	duration: 60 * 60 * 24,
});

export const attendanceLimiter = createRateLimiterMiddleware({
	keyPrefix: 'mark_attendance',
	points: 60,
	duration: 60,
});

export const renameClassLimiter = createRateLimiterMiddleware({
	keyPrefix: 'rename_class',
	points: 20,
	duration: 60,
});

export const deleteClassLimiter = createRateLimiterMiddleware({
	keyPrefix: 'delete_class',
	points: 5,
	duration: 60,
	blockDuration: 60 * 3
})
