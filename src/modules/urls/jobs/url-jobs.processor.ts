import { EntityManager } from "@mikro-orm/postgresql";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { Url } from "../entities/url.entity";

export type UpdateAccessCountJob = {
    alias: string;
    increaseBy: number;
};

@Processor("urls")
@Injectable()
export class UrlJobsProcessor extends WorkerHost {
    constructor(private readonly em: EntityManager) {
        super();
    }

    public async updateAccessCountJob(job: Job<UpdateAccessCountJob>) {
        const data = job.data;

        if (!data.alias) {
            return;
        }

        await this.em
            .getRepository(Url)
            .incrementAccessCount({ alias: data.alias }, data.increaseBy);

        await job.updateProgress(100);
    }

    public async process(job: Job) {
        switch (job.name) {
            case "update-access-count":
                await this.updateAccessCountJob(job);
                break;
        }
    }
}
