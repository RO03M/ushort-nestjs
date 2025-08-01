import { EntityManager } from "@mikro-orm/postgresql";
import { ConflictException, Injectable } from "@nestjs/common";
import { genRandomChars } from "../../../utils/random";
import { Url } from "../entities/url.entity";

@Injectable()
export class UrlsService {
    constructor(private readonly em: EntityManager) { }

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

        throw new Error(`Couldn't create a unique random alias after ${attempts} tries. Try again`);
    }

    public isAliasValid(alias: string) {
        return !/[^a-zA-Z0-9 ]/.test(alias);
    }
}
