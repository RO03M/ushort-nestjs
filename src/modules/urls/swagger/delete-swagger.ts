import { applyDecorators } from "@nestjs/common";
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";

export function ApplyDeleteUrlSwagger() {
    return applyDecorators(
        ApiOkResponse({
            example: {
                success: true
            }
        }),
        ApiNotFoundResponse({
            example: {
                message: "Url with this alias doesn't exist",
                error: "Not Found",
                statusCode: 404
            }
        }),
        ApiForbiddenResponse({
            example: {
                message: "You cannot delete this url, since it isn't yours",
                error: "Forbidden",
                statusCode: 403
            }
        })
    );
}