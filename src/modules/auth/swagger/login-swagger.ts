import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

export function ApplyLoginSwagger() {
    return applyDecorators(
        ApiBody({
            description: "teste",
            examples: {
                login: {
                    value: {
                        email: "romera@email.com",
                        password: "senhapotente"
                    }
                }
            }
        }),
        ApiOkResponse({
            examples: {
                success: {
                    summary: "Default",
                    value: {
                        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2Y2E0YzRjYy03NGI3LTRjMmEtYWMxNi1kMjk1OTMzNTIyMjIiLCJpYXQiOjE3NTQyMjc4MjAsImV4cCI6MTc1NDMxNDIyMH0._U0N7b7uKvi5nFMqe8YSJM6IW1H3SiR9GH84xnnNR0k"
                    }
                }
            }
        }),
        ApiUnauthorizedResponse({
            examples: {
                wrongPass: {
                    summary: "Default",
                    value: {
                        message: "Wrong password",
                        error: "Unauthorized",
                        statusCode: 401
                    }
                }
            }
        }),
        ApiNotFoundResponse({
            example: {
                message: "User with email romera@idk.com doesn't exist",
                error: "Not Found",
                statusCode: 404
            }
        })
    )
}