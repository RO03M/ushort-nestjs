import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class UrlCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache
    ) { }

    public async cacheUrl(alias: string, longUrl: string) {
        await this.cache.set(`urls:alias:${alias}`, longUrl);
    }

    public async getCached(alias: string) {
        return await this.cache.get<string>(`urls:alias:${alias}`);
    }

    public async invalidateCache(alias: string) {
        await this.cache.del(`urls:alias:${alias}`);
    }
}