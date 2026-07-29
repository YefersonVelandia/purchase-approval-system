import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { PurchaseRequestStatus } from "../../domain/entities/purchase-request.entity";
import { DynamoDBPurchaseRequestRepository } from "../../infrastructure/repositories/dynamodb-purchase-request.repository";
import { UpdatePurchaseRequestStatusUseCase } from "../../application/use-cases/update-purchase-request-status.use-case";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing purchase request id",
        }),
      };
    }

    const body = JSON.parse(event.body ?? "{}");

    const status = body.status as PurchaseRequestStatus;

    const repository = new DynamoDBPurchaseRequestRepository();

    const useCase = new UpdatePurchaseRequestStatusUseCase(repository);

    const result = await useCase.execute(id, status);

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
