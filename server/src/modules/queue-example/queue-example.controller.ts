import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { Queue } from "bullmq";
import { CreateDummyDto } from "./dto/create-dummy.dto";

@Controller()
export class QueueExampleController {
	constructor(
		@InjectQueue("queue")
		private readonly queue: Queue
	) {}

	@Post("queue")
	public async queueTrigger(@Body() body: CreateDummyDto) {
		const job = await this.queue.add("jobname", { id: body.id });

		return job;
	}

	@Get("queue-info")
	public async getQueueInfo() {
		return await this.queue.getWaitingCount();
	}
}
