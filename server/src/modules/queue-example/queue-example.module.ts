import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { QueueConsumer } from "./queue.consumer";
import { QueueExampleController } from "./queue-example.controller";

@Module({
	imports: [
		BullModule.registerQueue({
			name: "queue"
		})
	],
	providers: [QueueConsumer],
	controllers: [QueueExampleController]
})
export class QueueExampleModule {}
