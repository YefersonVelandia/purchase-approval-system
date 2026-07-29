import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { DynamoDBApprovalRepository } from "../../infrastructure/repositories/dynamodb-approval.repository";

import { UpdateApprovalStatusUseCase } from "../../application/use-cases/update-approval-status.use-case";

import { ApprovalStatus } from "../../domain/entities/approval.entity";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing approval id",
        }),
      };
    }

    const body = JSON.parse(event.body ?? "{}");

    const repository = new DynamoDBApprovalRepository();

    const useCase = new UpdateApprovalStatusUseCase(repository);

    const result = await useCase.execute({
      id,
      status: body.status as ApprovalStatus,
    });

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
