import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect("Hello World!");
	});

	it("Redis assign and retrieve", async () => {
		const random = Math.random();

		await request(app.getHttpServer())
			.get(`/redis-test-assign?value=${random}`)
			.expect(200);

		await request(app.getHttpServer())
			.get(`/redis-test-retrieve`)
			.then((response) => {
				expect(response.body.value).toBeDefined();
				expect(response.body.value).toBe(random.toString());
			});
	});
});
