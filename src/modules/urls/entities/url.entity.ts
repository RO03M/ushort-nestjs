import { randomUUID } from "node:crypto";
import {
    Entity,
    EntityRepositoryType,
    PrimaryKey,
    Property
} from "@mikro-orm/core";
import { UrlRepository } from "../repositories/url.repository";

@Entity({ tableName: "urls", repository: () => UrlRepository })
export class Url {
    [EntityRepositoryType]?: UrlRepository;

    @PrimaryKey({ type: "uuid" })
    public id: string;

    @Property()
    public long_url: string;

    @Property()
    public alias: string;

    @Property()
    public visits: number;

    @Property()
    public user_id: string | null;

    public static make(longUrl: string, alias: string, userId?: string) {
        const url = new Url();
        url.id = randomUUID();
        url.long_url = longUrl;
        url.alias = alias;
        url.user_id = userId ?? null;

        return url;
    }
}
