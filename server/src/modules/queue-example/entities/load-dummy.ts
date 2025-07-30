import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "load_dummy" })
export class LoadDummy {
	@PrimaryKey({ autoincrement: true })
	public id?: number;

	@Property()
	public random: string | null = null;

	@Property()
	public count: number;
}
