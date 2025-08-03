import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Req
} from "@nestjs/common";
import { Request } from "express";
import { slug } from "../../utils/slug";
import { CurrentUser } from "../auth/decorators/current-user";
import { IsLogged } from "../auth/decorators/is-logged";
import { UseOptionalAuth } from "../auth/decorators/use-optional-auth";
import { User } from "../auth/user.entity";
import { CreateUrlDto } from "./dto/create-url.dto";
import { UpdateUrlDto } from "./dto/update-url.dto";
import { Url } from "./entities/url.entity";
import { UrlsService } from "./services/urls.service";
import { ApplyCreateUrlSwagger } from "./swagger/create-swagger";
import { ApplyDeleteUrlSwagger } from "./swagger/delete-swagger";
import { ApplyMyUrlsSwagger } from "./swagger/my-urls-swagger";
import { ApplyUpdateUrlSwagger } from "./swagger/update-swagger";

@Controller("/urls")
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) { }

    @Post()
    @UseOptionalAuth()
    @ApplyCreateUrlSwagger()
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

    @Patch("/update")
    @IsLogged()
    @ApplyUpdateUrlSwagger()
    public async changeUrl(
        @Body() body: UpdateUrlDto,
        @CurrentUser() user: User
    ) {
        const url = await this.urlsService.findUrlByAlias(body.alias);

        if (!url) {
            throw new NotFoundException("Url with this alias doesn't exist");
        }

        if (url?.user_id !== user.id) {
            throw new ForbiddenException(
                "You cannot update this url, since it isn't yours"
            );
        }

        if (!body.newAlias && !body.newLongUrl) {
            return { url };
        }

        if (body.newAlias !== undefined) {
            if (!this.urlsService.isAliasValid(body.newAlias)) {
                throw new BadRequestException("Invalid alias format");
            }

            url.alias = slug(body.newAlias);
        }

        if (body.newLongUrl) {
            url.long_url = body.newLongUrl;
        }

        await this.urlsService.updateUrl(body.alias, url);

        return { url };
    }

    @Delete("/:alias")
    @IsLogged()
    @ApplyDeleteUrlSwagger()
    public async deleteUrl(
        @Param("alias") alias: string,
        @CurrentUser() user: User
    ) {
        const url = await this.urlsService.findUrlByAlias(alias);

        if (!url) {
            throw new NotFoundException("Url with this alias doesn't exist");
        }

        if (url?.user_id !== user.id) {
            throw new ForbiddenException(
                "You cannot delete this url, since it isn't yours"
            );
        }

        const deleted = await this.urlsService.softDeleteUrl(alias);

        return {
            success: deleted
        };
    }

    @Get("/me")
    @IsLogged()
    @ApplyMyUrlsSwagger()
    public async getUrlsFromLoggedUser(@CurrentUser() user: User) {
        const urls = await this.urlsService.findByUserId(user.id);

        return {
            urls
        };
    }
}
