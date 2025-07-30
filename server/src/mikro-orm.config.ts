import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import type { PostgreSqlOptions } from "@mikro-orm/postgresql/PostgreSqlMikroORM";
import { config } from "dotenv";
import { ENTITIES } from "./database/entities";

config();

export const mikroormConfig: PostgreSqlOptions = {
	entities: ENTITIES,
	discovery: {
		warnWhenNoEntities: false
	},
	driver: PostgreSqlDriver,
	dbName: process.env.DB_NAME,
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	debug: true,
	seeder: {
		path: "dist/database/seeders",
		pathTs: "src/database/seeders"
	},
	migrations: {
		path: "src/database/migrations",
		pathTs: "src/database/migrations",
		transactional: false
	}
};

export default defineConfig(mikroormConfig);
