import { Migration } from '@mikro-orm/migrations';

export class Migration20250730231730_urls extends Migration {

  override async up(): Promise<void> {
    await this.getKnex().schema.createTable("urls", (table) => {
      table.uuid("id").primary();
      table.text("long-url").notNullable();
      table.string("hash", 8).notNullable();
      table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
      table.timestamps();
      table.timestamp("deleted_at").nullable();
    });
  }

  override async down(): Promise<void> {
    await this.getKnex().schema.dropTable("urls");
  }

}
