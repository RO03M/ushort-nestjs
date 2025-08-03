import { EntityManager } from "@mikro-orm/postgresql";
import { ConflictException, Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { genRandomChars } from "../../../utils/random";
import { Url } from "../entities/url.entity";
import { UrlCacheService } from "./url-cache.service";

@Injectable()
export class UrlsService {
    constructor(
        private readonly em: EntityManager,
        private readonly urlCacheService: UrlCacheService,
        @Inject("REDIS") private readonly redis: Redis
    ) { }

    public async createWithRandomAlias(longUrl: string, userId?: string) {
        const uniqueAlias = await this.generateUniqueAlias();

        const url = Url.make(longUrl, uniqueAlias, userId);

        await this.em.createQueryBuilder(Url).insert(url).execute("run", false);

        return url;
    }

    public async createWithPredefinedAlias(
        longUrl: string,
        alias: string,
        userId?: string
    ) {
        const exists = await this.aliasExists(alias);

        if (exists) {
            throw new ConflictException(`Alias ${alias} already exist`);
        }

        const url = Url.make(longUrl, alias, userId);

        await this.em.createQueryBuilder(Url).insert(url).execute("run", false);

        return url;
    }

    private async aliasExists(alias: string) {
        return await this.em.getRepository(Url).exists({ alias });
    }

    private async generateUniqueAlias(attempts = 20) {
        const aliasLength = 6;
        for (let i = 0; i < attempts; i++) {
            const alias = genRandomChars(aliasLength);

            const exists = await this.aliasExists(alias);

            if (!exists) {
                return alias;
            }
        }

        throw new Error(
            `Couldn't create a unique random alias after ${attempts} tries. Try again`
        );
    }

    public isAliasValid(alias: string) {
        return !/[^a-zA-Z0-9 -]/.test(alias);
    }

    public async getLongUrlFromAlias(alias: string) {
        const cachedUrl = await this.urlCacheService.getCached(alias);

        if (cachedUrl && typeof cachedUrl === "string") {
            return cachedUrl;
        }

        const url = await this.em
            .getRepository(Url)
            .noTrash()
            .select(["long_url"])
            .andWhere({ alias })
            .execute("get", false);

        if (!url) {
            return null;
        }

        await this.urlCacheService.cacheUrl(alias, url.long_url);

        return url.long_url;
    }

    public async incrementUrlCounter(alias: string) {
        await this.redis.hincrby(`urls:counters`, alias, 1);
    }

    public async findUrlByAlias(alias: string) {
        const url: Url | null = await this.em.createQueryBuilder(Url)
            .select(["id", "alias", "long_url", "user_id"])
            .where({ alias: alias })
            .execute("get", true);

        return url;
    }

    public async findByUserId(userId: string) {
        const urls = await this.em.createQueryBuilder(Url)
            .select(["alias", "long_url", "visits", "created_at", "updated_at", "deleted_at"])
            .where({ user_id: userId })
            .execute("all", false);

        return urls;
    }

    public async updateUrl(oldAlias: string, url: Url) {
        const response = await this.em.createQueryBuilder(Url)
            .update({ alias: url.alias, long_url: url.long_url, updated_at: new Date() })
            .where({ alias: oldAlias })
            .execute("run", false);

        if (response.affectedRows !== 0) {
            await this.urlCacheService.invalidateCache(oldAlias);
        }

        return response;
    }

    public async softDeleteUrl(alias: string) {
        const response = await this.em.createQueryBuilder(Url)
            .update({ deleted_at: new Date() })
            .where({ alias: alias })
            .execute("run", false);

        const success = response.affectedRows !== 0;

        if (success) {
            await this.urlCacheService.invalidateCache(alias);
        }

        return success;
    }
}
