import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "debug", "fatal"]
	});

	app.use(cookieParser());

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	const port = process.env.PORT ?? 3000;
	await app.listen(port);

	console.log("Ready");
	console.log(`Listening on :${port}`);
}

bootstrap();
