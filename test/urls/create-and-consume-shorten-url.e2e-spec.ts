import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

describe("Create and consume a short url", () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    const longUrl = "https://romera.vercel.app/";
    let alias = "";

    it("Should be able to create a short url", async () => {
        const response = await request(app.getHttpServer())
            .post("/urls/")
            .send({ longUrl: longUrl })

        expect(response.status === HttpStatus.OK || response.status === HttpStatus.CREATED).toBeTruthy();
        expect(response.body.url).toBeDefined();
        expect(response.body.url.alias).toBeDefined();
        expect(response.body.url.long_url).toBe(longUrl);
        expect(response.body.shortenedUrl).toBeDefined();

        alias = response.body.url.alias;
    });

    it("Shortened url should redirect to the correct long url", async () => {
        const response = await request(app.getHttpServer())
            .get(`/${alias}`)
            .expect(HttpStatus.TEMPORARY_REDIRECT);

        expect(response.headers.location).toBe(longUrl);
    });
});