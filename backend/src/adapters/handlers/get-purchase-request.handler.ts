import type { APIGatewayProxyStructuredResultV2, APIGatewayProxyEventV2  } from "aws-lambda";
import { DynamoDBPurchaseRequestRepository } from "../../infrastructure/repositories/dynamodb-purchase-request.repository";
import { GetPurchaseRequestUseCase } from "../../application/use-cases/get-purchase-request.use-case";

export const handler = async (event: APIGatewayProxyEventV2 ): Promise<APIGatewayProxyStructuredResultV2> => {
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

    const repository = new DynamoDBPurchaseRequestRepository();

    const useCase = new GetPurchaseRequestUseCase(repository);

    const result = await useCase.execute(id);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : "Purchase request not found",
      }),
    };
  }
};
