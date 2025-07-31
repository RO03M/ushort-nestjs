import { createKeyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { config } from "dotenv";
import { redisClientProvider } from "./redis-client";

config();

export function buildRedisUri() {
	if (process.env.REDIS_PASSWORD) {
		return `redis://${process.env.REDIS_USERNAME ?? ""}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
	}

	return `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
}

@Global()
@Module({
	imports: [
		CacheModule.register({
			isGlobal: true,
			stores: [createKeyv(buildRedisUri())]
		})
	],
	providers: [redisClientProvider],
	exports: [redisClientProvider]
})
export class RedisModule {}
