import {
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Res
} from "@nestjs/common";
import { Response } from "express";
import { UrlsService } from "./services/urls.service";

@Controller()
export class RedirectUrlController {
    constructor(
        private readonly urlsService: UrlsService
    ) { }

    @Get("/:alias")
    public async redirectToLongUrl(
        @Param("alias") alias: string,
        @Res() res: Response
    ) {
        const longUrl = await this.urlsService.getLongUrlFromAlias(alias);

        if (!longUrl) {
            throw new NotFoundException("Url não encontrada");
        }

        await this.urlsService.incrementUrlCounter(alias);

        res.redirect(HttpStatus.TEMPORARY_REDIRECT, longUrl);
    }
}
