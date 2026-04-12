import { setCache } from "./redisCache.js";

export async function blacklistToken(token: string, expiresAt: number) {
  const ttl = Math.floor((expiresAt - Date.now()) / 1000);

  if (ttl > 0) {
		await setCache(`bl:${token}`, "1", ttl);
  }
}
