import * as bcrypt from "bcryptjs";

export class Hash {
	public static make(password: string) {
		return bcrypt.hashSync(password, 12);
	}

	public static check(password: string, hash: string) {
		return bcrypt.compareSync(password, hash);
	}
}
