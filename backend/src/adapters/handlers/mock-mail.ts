import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { MockEmailRepository } from "../../infrastructure/notifications/mock-email.repository";

export const handler = async (): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const emails = MockEmailRepository.getEmails();

    return {
      statusCode: 200,
      body: JSON.stringify(emails),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : "Internal server error",
      }),
    };
  }
};
