import { Provider } from "@nestjs/common";
import { config } from "dotenv";
import Redis from "ioredis";

config();

export type REDIS = "REDIS";

export const redisProvider: Provider = {
    useFactory(): Redis {
        return new Redis({
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD
        })
    },
    provide: "REDIS"
}