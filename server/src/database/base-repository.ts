import { EntityRepository } from "@mikro-orm/postgresql";

export class BaseRepository<
	Entity extends object
> extends EntityRepository<Entity> {
	public noTrash() {
		return this.createQueryBuilder().where({ deleted_at: null });
	}

	public paginate(perPage = 15, pageIndex = 0) {
		return this.createQueryBuilder()
			.limit(perPage)
			.offset(perPage * pageIndex);
	}
}
