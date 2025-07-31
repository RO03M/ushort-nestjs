import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UrlsModule } from "./urls/urls.module";

@Module({
	imports: [AuthModule, UrlsModule]
})
export class LoaderModule {}
