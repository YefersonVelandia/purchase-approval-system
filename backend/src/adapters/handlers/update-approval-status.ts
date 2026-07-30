import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { DynamoDBApprovalRepository } from "../../infrastructure/repositories/dynamodb-approval.repository";

import { UpdateApprovalStatusUseCase } from "../../application/use-cases/update-approval-status.use-case";
import { GenerateEvidencePdfUseCase } from "../../application/use-cases/generate-evidence-pdf.use-case";

import { ApprovalStatus } from "../../domain/entities/approval.entity";
import { DynamoDBPurchaseRequestRepository } from "../../infrastructure/repositories/dynamodb-purchase-request.repository";
import { getStorageRepository } from "../../infrastructure/storage/storage.factory";

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

    const approvalRepository = new DynamoDBApprovalRepository();

    const purchaseRequestRepository = new DynamoDBPurchaseRequestRepository();

    const storageRepository = getStorageRepository();

    const evidencePdfUseCase = new GenerateEvidencePdfUseCase(
      purchaseRequestRepository,
      approvalRepository,
      storageRepository,
    );

    const useCase = new UpdateApprovalStatusUseCase(
      approvalRepository,
      purchaseRequestRepository,
      evidencePdfUseCase,
    );

    const result = await useCase.execute({
      id,
      status: body.status as ApprovalStatus,
      signedBy: body.signedBy as string,
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
