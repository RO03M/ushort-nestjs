import { Module } from "@nestjs/common";
import { UrlsController } from "./urls.controller";
import { RedirectUrlController } from "./redirect-url.controller";
import { UrlsService } from "./services/urls.service";

@Module({
    controllers: [UrlsController, RedirectUrlController],
    providers: [UrlsService]
})
export class UrlsModule { }