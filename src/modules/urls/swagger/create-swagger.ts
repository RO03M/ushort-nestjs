import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiOkResponse } from "@nestjs/swagger";

export function ApplyCreateUrlSwagger() {
    return applyDecorators(
        ApiBody({
            description: "Url creation",
            examples: {
                customAlias: {
                    summary: "Custom alias",
                    value: {
                        longUrl: "https://romera.vercel.app/",
                        alias: "portfolio"
                    }
                },
                randomAlias: {
                    summary: "Random alias",
                    value: {
                        longUrl: "https://romera.vercel.app/"
                    }
                }
            }
        }),
        ApiOkResponse({
            examples: {
                successCustom: {
                    summary: "Custom alias",
                    value: {
                        url: {
                            id: "85264792-7183-4891-bed7-be1711d5235a",
                            long_url: "https://romera.vercel.app/ ",
                            alias: "portfolio",
                            user_id: "6ca4c4cc-74b7-4c2a-ac16-d29593352222",
                            created_at: "2025-08-03T14:17:43.155Z",
                            updated_at: "2025-08-03T14:17:43.155Z",
                            deleted_at: null
                        },
                        shortenedUrl: "http://localhost:3000/portfolio"
                    }
                },
                successRandom: {
                    summary: "Random alias",
                    value: {
                        url: {
                            id: "85264792-7183-4891-bed7-be1711d5235a",
                            long_url: "https://romera.vercel.app/ ",
                            alias: "yHgYnY",
                            user_id: "6ca4c4cc-74b7-4c2a-ac16-d29593352222",
                            created_at: "2025-08-03T14:17:43.155Z",
                            updated_at: "2025-08-03T14:17:43.155Z",
                            deleted_at: null
                        },
                        shortenedUrl: "http://localhost:3000/yHgYnY"
                    }
                }
            }
        }),
        ApiBadRequestResponse({
            examples: {
                invalidAlias: {
                    summary: "Invalid custom alias",
                    value: {
                        message: "Invalid alias format",
                        error: "Bad Request",
                        statusCode: 400
                    }
                }
            }
        }),
        ApiConflictResponse({
            example: {
                message: "Alias something already exist",
                error: "Conflict",
                statusCode: 409
            }
        })
    );
}