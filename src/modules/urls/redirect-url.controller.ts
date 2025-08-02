import {
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Res
} from "@nestjs/common";
import { Response } from "express";
import { UrlJobsProducer } from "./jobs/url-jobs.producer";
import { UrlsService } from "./services/urls.service";

@Controller()
export class RedirectUrlController {
    constructor(
        private readonly urlsService: UrlsService,
        private readonly urlQueueProducer: UrlJobsProducer
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


        await this.urlQueueProducer.incrementAccessCount(alias);

        res.redirect(HttpStatus.MOVED_PERMANENTLY, longUrl);
    }
}
