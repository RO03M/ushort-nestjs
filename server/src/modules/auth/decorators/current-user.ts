import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthedRequest } from "../types";

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request: AuthedRequest = context.switchToHttp().getRequest();

    return request.user;
});