import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";

export function ApplyUpdateUrlSwagger() {
    return applyDecorators(
        ApiBody({
            description: "Url update",
            examples: {
                example: {
                    value: {
                        alias: "yHgYnY",
                        newLongUrl: "https://www.youtube.com/watch?v=1DnSiznUrVI"
                    }
                }
            }
        }),
        ApiOkResponse({
            example: {
                "url": {
                    "id": "42fe7cbf-690c-423b-9660-f9e1e651e80e",
                    "long_url": "https://www.youtube.com/watch?v=1DnSiznUrVI",
                    "alias": "yHgYnY",
                    "user_id": "6ca4c4cc-74b7-4c2a-ac16-d29593352222"
                }
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
                message: "You cannot update this url, since it isn't yours",
                error: "Forbidden",
                statusCode: 403
            }
        }),
        ApiBadRequestResponse({
            example: {
                message: "Invalid alias format",
                error: "Bad Request",
                statusCode: 400
            }
        }),
    )
}