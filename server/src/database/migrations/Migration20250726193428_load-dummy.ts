import { Migration } from "@mikro-orm/migrations";

export class Migration20250726193428_load_dummy extends Migration {
	override async up(): Promise<void> {
		await this.getKnex().schema.createTable("load_dummy", (table) => {
			table.increments().primary();
			table.string("random").nullable();
			table.integer("count", 11);
		});
	}

	override async down(): Promise<void> {
		await this.getKnex().schema.dropTable("load_dummy");
	}
}
