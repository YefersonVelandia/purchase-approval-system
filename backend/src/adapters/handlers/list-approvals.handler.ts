import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { DynamoDBApprovalRepository } from "../../infrastructure/repositories/dynamodb-approval.repository";
import { ListApprovalsUseCase } from "../../application/use-cases/list-approvals.use-case";

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

    const repository = new DynamoDBApprovalRepository();

    const useCase = new ListApprovalsUseCase(repository);

    const result = await useCase.execute(purchaseRequestId);

    return {
      statusCode: 200,
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
