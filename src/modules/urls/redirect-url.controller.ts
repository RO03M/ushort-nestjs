import { EntityManager } from "@mikro-orm/postgresql";
import { Controller, Get, HttpStatus, NotFoundException, Param, Res } from "@nestjs/common";
import { Url } from "./entities/url.entity";
import { Response } from "express";

@Controller()
export class RedirectUrlController {
    constructor(
        private readonly em: EntityManager
    ) { }

    @Get("/:alias")
    public async redirectToLongUrl(
        @Param("alias") alias: string,
        @Res() res: Response
    ) {
        const url = await this.em.createQueryBuilder(Url).select(["long_url"]).where({ alias }).execute("get", false);

        if (!url) {
            throw new NotFoundException("Url não encontrada");
        }

        res.redirect(HttpStatus.MOVED_PERMANENTLY, url.long_url);
    }
}