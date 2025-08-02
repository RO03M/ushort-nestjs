import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { UrlJobsProcessor } from "./url-jobs.processor";
import { UrlJobsProducer } from "./url-jobs.producer";

@Module({
    imports: [
        BullModule.registerQueue({
            name: "urls"
        })
    ],
    providers: [UrlJobsProducer, UrlJobsProcessor],
    exports: [
        BullModule.registerQueue({
            name: "urls"
        }),
        UrlJobsProducer
    ]
})
export class UrlJobsModule { }