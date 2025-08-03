import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { config } from "dotenv";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { LoaderModule } from "./modules/loader.module";
import { buildRedisUri, RedisModule } from "./providers/redis/redis.module";

config();

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
		RedisModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: {
				expiresIn: "1d"
			}
		}),
		ScheduleModule.forRoot(),
		BullModule.forRoot({
			connection: {
				url: buildRedisUri()
			},
			defaultJobOptions: {
				removeOnComplete: 100,
				removeOnFail: 1000,
				attempts: 3,
				backoff: {
					type: "exponential",
					delay: 1000
				}
			}
		}),
		LoaderModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule { }
