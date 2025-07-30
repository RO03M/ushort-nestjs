import { randomUUID } from "node:crypto";
import {
	Entity,
	EntityRepositoryType,
	PrimaryKey,
	Property
} from "@mikro-orm/core";
import { BaseRepository } from "../../database/base-repository";
import { Hash } from "../../utils/hash";

@Entity({ tableName: "users", repository: () => BaseRepository<User> })
export class User {
	[EntityRepositoryType]?: BaseRepository<User>;

	@PrimaryKey()
	public id: string;

	@Property()
	public name: string;

	@Property()
	public email: string;

	@Property()
	public username: string;

	@Property({ hidden: true })
	public password: string;

	@Property({ type: "timestamp" })
	public created_at?: Date = new Date();

	@Property({ type: "timestamp" })
	public updated_at?: Date = new Date();

	@Property({ type: "timestamp" })
	public deleted_at: Date | null = null;

	static make(name: string, email: string, username: string, password: string) {
		const user = new User();
		user.id = randomUUID();
		user.name = name;
		user.email = email;
		user.username = username;
		user.password = Hash.make(password);

		return user;
	}
}
