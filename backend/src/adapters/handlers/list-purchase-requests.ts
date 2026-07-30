import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { DynamoDBPurchaseRequestRepository } from "../../infrastructure/repositories/dynamodb-purchase-request.repository";
import { ListPurchaseRequestsUseCase } from "../../application/use-cases/list-purchase-requests.use-case";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  void event;

  try {
    const repository = new DynamoDBPurchaseRequestRepository();

    const useCase = new ListPurchaseRequestsUseCase(repository);

    const result = await useCase.execute();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("listPurchaseRequests error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : "Internal server error",
        errorName: error instanceof Error ? error.constructor.name : typeof error,
        ...(error instanceof Error && { stack: error.stack?.split("\n").slice(0, 5).join("\n") }),
      }),
    };
  }
};
