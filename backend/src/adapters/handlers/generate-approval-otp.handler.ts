import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { DynamoDBApprovalRepository } from "../../infrastructure/repositories/dynamodb-approval.repository";
import { GenerateApprovalOtpUseCase } from "../../application/use-cases/generate-approval-otp.use-case";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const approvalToken = event.pathParameters?.token;

    if (!approvalToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing approval token",
        }),
      };
    }

    const repository = new DynamoDBApprovalRepository();

    const useCase = new GenerateApprovalOtpUseCase(repository);

    const result = await useCase.execute({
      approvalToken,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "OTP generated successfully",
        ...result,
      }),
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
