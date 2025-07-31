import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthedRequest } from "../types";

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
    const request: AuthedRequest = context.switchToHttp().getRequest();

    return request.user;
});