import { FilterQuery, raw } from "@mikro-orm/core";
import { BaseRepository } from "../../../database/base-repository";
import { Url } from "../entities/url.entity";

export class UrlRepository extends BaseRepository<Url> {
    public async incrementAccessCount(where: FilterQuery<Url>, by = 1) {
        await this.qb().update({ visits: raw(`visits + ${by}`) }).where(where).execute("run", false);
    }
}