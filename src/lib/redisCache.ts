import { redisClient } from '#root/config/redis.js';

export const getCache = async (key: string) => {
	const data = await redisClient.get(`${key}:cache`);
	return data ? JSON.parse(data) : null;
}

export const setCache = async (key: string, value: string, ttl: number = 60) => {
	await redisClient.setex(`${key}:cache`, ttl, value);
}

export const deleteCache = async (key: string) => {
	const pattern = `${key}:cache`;

	if (!key.includes('*')) {
		await redisClient.del(pattern);
		return;
	}

	let cursor = '0';
	do {
		const [nextCursor, keys] = await redisClient.scan(
			cursor,
			'MATCH', pattern,
			'COUNT', 100
		);
		cursor = nextCursor;

		if (keys.length > 0) {
			await redisClient.del(...keys);
		}
	} while (cursor !== '0');
}
