import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import Redis from "ioredis";
import { UpdateAccessCountJob } from "./url-jobs.processor";
import { UrlJobsProducer } from "./url-jobs.producer";

@Injectable()
export class VisitsService {
    constructor(
        @Inject("REDIS") private readonly redis: Redis,
        private readonly urlQueueProducer: UrlJobsProducer
    ) { }

    @Cron(CronExpression.EVERY_30_SECONDS)
    public async incrementVisitsCounter() {
        const jobsBulk: UpdateAccessCountJob[] = [];

        const countersHash = await this.redis.eval(`
            local data = redis.call("HGETALL", KEYS[1])
            redis.call("DEL", "urls:counters")
            return data
        `, 1, "urls:counters");

        if (!countersHash || !Array.isArray(countersHash) || countersHash.length <= 1 || typeof countersHash[0] !== "string") {
            return;
        }

        for (let i = 0; i < countersHash.length; i += 2) {
            const alias = countersHash[i];
            const count = Number(countersHash[i + 1]);

            if (Number.isNaN(count)) {
                continue;
            }

            jobsBulk.push({
                alias: alias,
                increaseBy: count
            });
        }

        await this.urlQueueProducer.updateAccessCount(jobsBulk);
    }
}
