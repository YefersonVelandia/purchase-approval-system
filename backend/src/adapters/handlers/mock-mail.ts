import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { createMockEmailRepository } from "../../infrastructure/notifications/dynamodb-mock-email.repository";

export const handler = async (): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const notificationRepository = createMockEmailRepository();
    const emails = await notificationRepository.list();

    // Convert Date objects to ISO strings for JSON serialization
    const serializedEmails = emails.map((email) => ({
      ...email,
      sentAt: email.sentAt instanceof Date ? email.sentAt.toISOString() : email.sentAt,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(serializedEmails),
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
