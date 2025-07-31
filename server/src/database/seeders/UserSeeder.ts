import { faker } from "@faker-js/faker";
import { EntityManager } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../../modules/auth/user.entity";

export class UserSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const users: User[] = [];

		console.log("Criando alguns usuários aleatórios. Aguarde alguns segundos pois a hash da senha faz o processo ser um pouco lento");

		for (let i = 0; i < 9; i++) {
			const user = User.make(
				faker.person.fullName(),
				faker.internet.email(),
				faker.internet.password()
			);

			users.push(user);
		}

		const masterUserExists = await em.getRepository(User).exists({ email: "romera@email.com" });

		if (!masterUserExists) {
			users.push(await User.make("Romera", "romera@email.com", "senhapotente"));
		}

		await em.createQueryBuilder(User).insert(users);

		console.log("Usuários criados!");
	}
}
