import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { UpdateAccessCountJob } from "./url-jobs.processor";

@Injectable()
export class UrlJobsProducer {
    constructor(
        @InjectQueue("urls")
        private readonly queue: Queue<UpdateAccessCountJob>
    ) { }

    public async updateAccessCount(jobs: UpdateAccessCountJob[]) {
        const bulkJobs = jobs.map((job) => ({ name: "update-access-count", data: job }))
        const jobsResponse = await this.queue.addBulk(bulkJobs);

        return jobsResponse;
    }
}