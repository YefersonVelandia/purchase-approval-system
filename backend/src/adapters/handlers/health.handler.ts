import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export const handler = async (): Promise<APIGatewayProxyStructuredResultV2> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "ok",
      service: "purchase-approval-system",
      timestamp: new Date().toISOString(),
    }),
  };
};
