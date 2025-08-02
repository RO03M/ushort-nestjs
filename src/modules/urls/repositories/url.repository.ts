import { FilterQuery, raw } from "@mikro-orm/core";
import { BaseRepository } from "../../../database/base-repository";
import { Url } from "../entities/url.entity";

export class UrlRepository extends BaseRepository<Url> {
    public async incrementAccessCount(where: FilterQuery<Url>) {
        await this.qb().update({ visits: raw("visits + 1") }).where(where).execute("run", false);
    }
}