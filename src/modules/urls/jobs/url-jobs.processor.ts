import { EntityManager } from "@mikro-orm/postgresql";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { Url } from "../entities/url.entity";

type IncrementAccessCountJob = {
    alias: string;
};

@Processor("urls")
@Injectable()
export class UrlJobsProcessor extends WorkerHost {
    constructor(private readonly em: EntityManager) {
        super();
    }

    public async incrementAccessCountJob(job: Job<IncrementAccessCountJob>) {
        const data = job.data;

        if (!data.alias) {
            return;
        }

        await this.em
            .getRepository(Url)
            .incrementAccessCount({ alias: job.data.alias });

        await job.updateProgress(100);
    }

    public async process(job: Job) {
        switch (job.name) {
            case "increment-access-count":
                await this.incrementAccessCountJob(job);
                break;
        }
    }
}
