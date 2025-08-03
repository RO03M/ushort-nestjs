import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConflictResponse, ApiOkResponse } from "@nestjs/swagger";

export function ApplyRegisterSwagger() {
    return applyDecorators(
        ApiBody({
            description: "teste",
            examples: {
                login: {
                    value: {
                        name: "John Doe",
                        email: "john@doe.com",
                        password: "goodpassword123//@"
                    }
                }
            }
        }),
        ApiOkResponse({
            example: {
                id: "598349cd-f05b-4eec-b627-a48ac1107a3a",
                name: "John Doe",
                email: "john@doe.com",
                created_at: "2025-08-03T13:42:58.263Z",
                updated_at: "2025-08-03T13:42:58.263Z",
                deleted_at: null
            }
        }),
        ApiConflictResponse({
            example: {
                message: "A user with the email john@doe.com already exists",
                error: "Conflict",
                statusCode: 409
            }
        })
    )
}