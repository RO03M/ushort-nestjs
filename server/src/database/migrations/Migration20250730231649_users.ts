import { Migration } from '@mikro-orm/migrations';

export class Migration20250730231649_users extends Migration {

  override async up(): Promise<void> {
    await this.getKnex().schema.createTable("users", async (table) => {
      table.uuid("id").primary();
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable();
      table.string("password", 255).notNullable();
      table.timestamps();
      table.timestamp("deleted_at").nullable();
    });
  }

  override async down(): Promise<void> {
    await this.getKnex().schema.dropTable("users");
  }

}
