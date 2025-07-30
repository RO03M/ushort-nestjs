import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { QueueExampleModule } from "./queue-example/queue-example.module";

@Module({
	imports: [AuthModule, QueueExampleModule]
})
export class LoaderModule {}
