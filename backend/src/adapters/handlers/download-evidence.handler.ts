import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { DynamoDBPurchaseRequestRepository } from "../../infrastructure/repositories/dynamodb-purchase-request.repository";
import { DynamoDBApprovalRepository } from "../../infrastructure/repositories/dynamodb-approval.repository";
import { getStorageRepository } from "../../infrastructure/storage/storage.factory";
import { GenerateEvidencePdfUseCase } from "../../application/use-cases/generate-evidence-pdf.use-case";

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

    const purchaseRequestRepository = new DynamoDBPurchaseRequestRepository();
    const approvalRepository = new DynamoDBApprovalRepository();
    const storageRepository = getStorageRepository();

    const useCase = new GenerateEvidencePdfUseCase(
      purchaseRequestRepository,
      approvalRepository,
      storageRepository,
    );

    const url = await useCase.execute({ purchaseRequestId: id });

    return {
      statusCode: 200,
      body: JSON.stringify({
        url,
        message: "PDF evidence generated successfully",
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
