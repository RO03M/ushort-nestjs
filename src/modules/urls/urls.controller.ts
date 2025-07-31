import { Body, Controller, Post } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user";
import { UseOptionalAuth } from "../auth/decorators/use-optional-auth";
import { User } from "../auth/user.entity";
import { CreateUrlDto } from "./dto/create-url.dto";
import { Url } from "./entities/url.entity";
import { UrlsService } from "./services/urls.service";

@Controller("/urls")
export class UrlsController {
    constructor(
        private readonly urlsService: UrlsService
    ) { }

    @Post()
    @UseOptionalAuth()
    public async create(@Body() body: CreateUrlDto, @CurrentUser() user?: User) {
        let url: Url;
        if (body.alias) {
            url = await this.urlsService.createWithPredefinedAlias(
                body.longUrl,
                body.alias,
                user?.id
            );
        } else {
            url = await this.urlsService.createWithRandomAlias(
                body.longUrl,
                user?.id
            );
        }

        return {
            url: url
        };
    }
}
