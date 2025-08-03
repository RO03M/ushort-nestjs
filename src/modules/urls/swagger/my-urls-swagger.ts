import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";

export function ApplyMyUrlsSwagger() {
    return applyDecorators(
        ApiOkResponse({
            example: {
                urls: [
                    {
                        alias: "portfolio",
                        long_url: "https://romera.vercel.app/",
                        visits: 0,
                        created_at: "2025-08-03 14:32:45.517+00",
                        updated_at: "2025-08-03 14:32:45.517+00",
                        deleted_at: null
                    }
                ]
            }
        })
    )
}