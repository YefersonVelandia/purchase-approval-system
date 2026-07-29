import type { MiddlewareObj, Request } from "@middy/core";

import { HttpError } from "../../shared/errors/http.error";

export const errorMiddleware = (): MiddlewareObj => ({
  onError: async (request: Request) => {
    const error = request.error;

    if (error instanceof HttpError) {
      request.response = {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
        }),
      };

      return;
    }

    request.response = {
      statusCode: 500,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  },
});
