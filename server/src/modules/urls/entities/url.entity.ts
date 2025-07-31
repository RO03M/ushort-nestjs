import { Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core";
import { BaseRepository } from "../../../database/base-repository";
import { User } from "../../auth/user.entity";
import { randomUUID } from "node:crypto";

@Entity({ tableName: "urls", repository: () => BaseRepository<User> })
export class Url {
    [EntityRepositoryType]?: BaseRepository<Url>;

    @PrimaryKey({ type: "uuid" })
    public id: string;

    @Property()
    public long_url: string;

    @Property()
    public alias: string;

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