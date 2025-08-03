import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { UrlJobsProcessor } from "./url-jobs.processor";
import { UrlJobsProducer } from "./url-jobs.producer";
import { VisitsService } from "./visits.service";

@Module({
    imports: [
        BullModule.registerQueue({
            name: "urls"
        })
    ],
    providers: [UrlJobsProducer, UrlJobsProcessor, VisitsService],
    exports: [
        BullModule.registerQueue({
            name: "urls"
        }),
        UrlJobsProducer
    ]
})
export class UrlJobsModule { }