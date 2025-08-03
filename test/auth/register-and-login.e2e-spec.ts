import { faker } from "@faker-js/faker/.";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

describe("Register and login with a new user", () => {
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

    const randomUser = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    };

    it("Should be able to create a new user", async () => {
        const response = await request(app.getHttpServer())
            .post("/auth/register")
            .send({
                name: randomUser.name,
                email: randomUser.email,
                password: randomUser.password
            });
        console.log(response.status, response.body)
        expect(
            response.status === HttpStatus.OK ||
            response.status === HttpStatus.CREATED
        ).toBeTruthy();
        expect(response.body.name).toBe(randomUser.name);
        expect(response.body.email).toBe(randomUser.email);
    });

    it("Should be able to log with it", async () => {
        const response = await request(app.getHttpServer()).post("/auth/login").send({
            email: randomUser.email,
            password: randomUser.password
        });

        expect(
            response.status === HttpStatus.OK ||
            response.status === HttpStatus.CREATED
        ).toBeTruthy();
        expect(response.body.accessToken).toBeDefined();
    });
});
