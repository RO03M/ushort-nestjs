import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Req
} from "@nestjs/common";
import { Request } from "express";
import { slug } from "../../utils/slug";
import { CurrentUser } from "../auth/decorators/current-user";
import { UseOptionalAuth } from "../auth/decorators/use-optional-auth";
import { User } from "../auth/user.entity";
import { CreateUrlDto } from "./dto/create-url.dto";
import { Url } from "./entities/url.entity";
import { UrlsService } from "./services/urls.service";

@Controller("/urls")
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) { }

    @Post()
    @UseOptionalAuth()
    public async create(
        @Body() body: CreateUrlDto,
        @CurrentUser() user: User | undefined,
        @Req() request: Request
    ) {
        let url: Url;

        if (body.alias) {
            if (!this.urlsService.isAliasValid(body.alias)) {
                throw new BadRequestException("Invalid alias format");
            }

            const aliasSlug = slug(body.alias);

            url = await this.urlsService.createWithPredefinedAlias(
                body.longUrl,
                aliasSlug,
                user?.id
            );
        } else {
            url = await this.urlsService.createWithRandomAlias(
                body.longUrl,
                user?.id
            );
        }

        return {
            url: url,
            shortenedUrl: `${request.protocol}://${request.headers.host}/${url.alias}`
        };
    }
}
