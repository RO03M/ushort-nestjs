import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class UrlJobsProducer {
    constructor(
        @InjectQueue("urls")
        private readonly queue: Queue
    ) { }

    public async incrementAccessCount(alias: string) {
        const job = await this.queue.add("increment-access-count", {
            alias: alias
        });

        return job;
    }
}