import { Module } from "@nestjs/common";
import { UrlJobsModule } from "./jobs/url-jobs.module";
import { RedirectUrlController } from "./redirect-url.controller";
import { UrlCacheService } from "./services/url-cache.service";
import { UrlsService } from "./services/urls.service";
import { UrlsController } from "./urls.controller";

@Module({
    imports: [UrlJobsModule],
    controllers: [UrlsController, RedirectUrlController],
    providers: [UrlsService, UrlCacheService]
})
export class UrlsModule { }
