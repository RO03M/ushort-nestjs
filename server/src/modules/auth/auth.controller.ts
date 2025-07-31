import { EntityManager } from "@mikro-orm/postgresql";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
	Body,
	ConflictException,
	Controller,
	Get,
	Inject,
	NotFoundException,
	Post,
	Query,
	Res,
	UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { Response } from "express";
import { Hash } from "../../utils/hash";
import { Duration, sleep } from "../../utils/time";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AccessToken } from "./types";
import { User } from "./user.entity";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly em: EntityManager,
		private readonly jwt: JwtService,
		@Inject(CACHE_MANAGER)
		private readonly cache: Cache
	) {}

	@Post("/register")
	public async register(@Body() body: RegisterDto) {
		const userExists = await this.em.getRepository(User).exists({ email: body.email });

		if (userExists) {
			throw new ConflictException(`Um usuário com e-mail ${body.email} já existe`);
		}

		const user = User.make(body.name, body.email, body.password);

		await this.em
			.createQueryBuilder(User)
			.insert(user)
			.execute("run", false);

		return user;
	}

	@Post("login")
	public async login(@Body() body: LoginDto, @Res() res: Response) {
		const user = await this.em
			.createQueryBuilder(User)
			.select(["id", "password"])
			.where({
				email: body.email
			})
			.execute("get", false);
		if (!user) {
			throw new NotFoundException(
				`User with email ${body.email} doesn't exist`
			);
		}

		const loginAttemptsKey = `login-attempts:${body.email}`;

		const passwordMatches = Hash.check(body.password, user.password);
		if (!passwordMatches) {
			const loginAttempts = await this.cache.get<number>(loginAttemptsKey);

			if (!loginAttempts) {
				await this.cache.set(loginAttemptsKey, 1, Duration.Hour);
			} else {
				await this.cache.set(
					loginAttemptsKey,
					+loginAttempts + 1,
					Duration.Hour
				);

				const sleepFor = 2 ** (+loginAttempts / 2) * Duration.Second;
				await sleep(Math.min(Duration.Second * 15, sleepFor));
			}

			throw new UnauthorizedException("Wrong password");
		}

		const payload: AccessToken = { uid: user.id };
		const accessToken = this.jwt.sign(payload);

		await this.cache.del(loginAttemptsKey);

		res.cookie("access_token", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: Duration.Day
		});

		res.send({
			accessToken
		});
	}
}
