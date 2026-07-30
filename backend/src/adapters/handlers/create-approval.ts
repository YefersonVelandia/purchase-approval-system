import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { DynamoDBApprovalRepository } from "../../infrastructure/repositories/dynamodb-approval.repository";
import { CreateApprovalUseCase } from "../../application/use-cases/create-approval.use-case";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const purchaseRequestId = event.pathParameters?.id;

    if (!purchaseRequestId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing purchase request id",
        }),
      };
    }

    const body = JSON.parse(event.body ?? "{}");

    const repository = new DynamoDBApprovalRepository();

    const useCase = new CreateApprovalUseCase(repository);

    const result = await useCase.execute({
      purchaseRequestId,
      approverId: body.approverId,
    });

    return {
      statusCode: 201,
      body: JSON.stringify(result),
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
