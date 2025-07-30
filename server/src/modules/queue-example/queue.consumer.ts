import { EntityManager } from "@mikro-orm/postgresql";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { LoadDummy } from "./entities/load-dummy";

@Processor("queue")
@Injectable()
export class QueueConsumer extends WorkerHost {
	constructor(private readonly em: EntityManager) {
		super();
	}

	private async jobnameProcessor(job: Job) {
		if (!job.data.id) {
			return;
		}
		const lastDummy = await this.em
			.createQueryBuilder(LoadDummy)
			.select("count")
			.where({
				id: job.data.id
			})
			.execute("get", false);

		if (!lastDummy) {
			await this.em
				.createQueryBuilder(LoadDummy)
				.insert({
					id: job.data.id,
					count: 1,
					random: ""
				})
				.execute("run", false);
			return;
		}

		await this.em
			.createQueryBuilder(LoadDummy)
			.update({
				count: lastDummy.count + 1
			})
			.where({
				id: job.data.id
			})
			.execute("run", false);
	}

	async process(job: Job): Promise<void> {
		switch (job.name) {
			case "jobname":
				await this.jobnameProcessor(job);
				job.updateProgress(100);
				break;
		}
	}
}
