import KeyvRedis, { RedisClientConnectionType } from "@keyv/redis";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Provider } from "@nestjs/common";
import { Cache } from "cache-manager";
import Keyv from "keyv";

export type RedisClient = RedisClientConnectionType;

export const REDIS_CLIENT = "REDIS_CLIENT";

export const redisClientProvider: Provider = {
	provide: REDIS_CLIENT,
	useFactory: async (cacheManager: Cache) => {
		const stores = cacheManager.stores;
		if (stores.length === 0 || !(stores[0] instanceof Keyv)) {
			return;
		}

		const redisStore = stores[0].store;

		if (!(redisStore instanceof KeyvRedis)) {
			return;
		}

		const client = await redisStore.client;

		return client;
	},
	inject: [CACHE_MANAGER]
};
