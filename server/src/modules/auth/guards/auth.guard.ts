import { EntityDTO, EntityManager } from "@mikro-orm/postgresql";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { Request } from "express";
import { safe } from "../../../utils/safe";
import { Duration } from "../../../utils/time";
import { AccessToken, AuthedRequest } from "../types";
import { User } from "../user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		@Inject(CACHE_MANAGER) private readonly cache: Cache,
		private readonly em: EntityManager,
		private readonly config: ConfigService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: AuthedRequest = context.switchToHttp().getRequest();

		const accessToken = this.getAccessToken(request);

		if (accessToken === null) {
			throw new UnauthorizedException("Please login to access this");
		}

		const jwtResult = safe(() =>
			this.jwtService.verify<AccessToken>(accessToken, {
				secret: this.config.get("ACCESS_TOKEN_SECRET")
			})
		);

		if (jwtResult.error !== null || !("uid" in jwtResult.data)) {
			throw new UnauthorizedException("Invalid access token");
		}

		const uid = jwtResult.data.uid;
		const user = await this.getCachedUser(uid);

		if (user === null) {
			throw new UnauthorizedException("Invalid user");
		}

		request.user = user;

		return true;
	}

	private async getCachedUser(uid: string): Promise<User | null> {
		const cacheKey = `user:${uid}`;
		const cachedUser = await this.cache.get<EntityDTO<User>>(cacheKey);

		if (cachedUser) {
			const user = new User();
			user.id = cachedUser.id;
			user.name = cachedUser.name;
			user.email = cachedUser.email;
			user.username = cachedUser.username;

			return user;
		}

		const user = await this.em
			.createQueryBuilder(User)
			.select(["id", "name", "email", "username"])
			.where({ id: uid })
			.execute("get", false);

		await this.cache.set(cacheKey, user, Duration.Second * 150);

		return user;
	}

	private getAccessToken(request: Request) {
		const authHeader = request.header("Authorization");

		if (authHeader === undefined) {
			return this.getAccessTokenFromCookie(request);
		}

		const [, accessToken] = authHeader.split(" ");

		if (!accessToken) {
			return this.getAccessTokenFromCookie(request);
		}

		return accessToken;
	}

	private getAccessTokenFromCookie(request: Request) {
		const cookieToken = request.cookies?.accessToken;

		if (!cookieToken || typeof cookieToken !== "string") {
			return null;
		}

		return cookieToken;
	}
}
