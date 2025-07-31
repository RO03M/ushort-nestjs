import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";

/**
 * Utilizado para situações em que o usuário não está logado
 * Mas se estiver, queremos ter a informação de qual é
 */
export function UseOptionalAuth() {
    return applyDecorators(UseGuards(AuthGuard), SetMetadata("isOptional", true));
}
