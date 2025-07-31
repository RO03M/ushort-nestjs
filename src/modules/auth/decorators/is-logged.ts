import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";

export function IsLogged() {
	return applyDecorators(UseGuards(AuthGuard));
}
