import { faker } from "@faker-js/faker";
import { EntityManager } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../../modules/auth/user.entity";

export class UserSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const users: User[] = [];

		for (let i = 0; i < 100; i++) {
			users.push(
				User.make(
					faker.person.fullName(),
					faker.internet.email(),
					faker.internet.password()
				)
			);
		}

		await em.createQueryBuilder(User).insert(users);
	}
}
