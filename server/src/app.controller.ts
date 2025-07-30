import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Controller, Get, Inject, Query } from "@nestjs/common";
import { Cache } from "cache-manager";
import { AppService } from "./app.service";
import { IsLogged } from "./modules/auth/decorators/is-logged";

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		@Inject(CACHE_MANAGER) private readonly cache: Cache
	) {}

	@Get("/authed")
	@IsLogged()
	public async authed() {
		return "ok";
	}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Get("/redis-test-assign")
	public async redisTestAssign(@Query("value") value: string) {
		const start = performance.now();
		await this.cache.set("key", value);
		const end = performance.now() - start;

		return `took ${end} ms`;
	}

	@Get("/redis-test-retrieve")
	public async redisTestRetrieve() {
		const start = performance.now();
		const value = await this.cache.get("key");
		const end = performance.now() - start;

		return {
			value: value,
			time: `${end} ms`
		};
	}
}
