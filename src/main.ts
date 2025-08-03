import { styleText } from "node:util";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "debug", "fatal"]
	});

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	const config = new DocumentBuilder()
		.setTitle("Encurtador de URL")
		.setVersion("1.0")
		.addBearerAuth()
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/dev", app, documentFactory);

	const port = process.env.PORT ?? 3000;
	await app.listen(port);

	console.log(
		`${styleText("green", "[SWAGGER DOCS]:")} ${styleText("blueBright", `http://localhost:${port}/api/dev`)}`
	);
	console.log(styleText("cyanBright", `Listening on :${port}`));
}

bootstrap();
