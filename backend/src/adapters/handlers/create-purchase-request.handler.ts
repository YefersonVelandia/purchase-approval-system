import middy from "@middy/core";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

import { CreatePurchaseRequestController } from "../controllers/create-purchase-request.controller";
import { CreatePurchaseRequestUseCase } from "../../application/use-cases/create-purchase-request.use-case";
import { DynamoDBPurchaseRequestRepository } from "../../infrastructure/repositories/dynamodb-purchase-request.repository";
import { errorMiddleware } from "../middlewares/error.middleware";

const baseHandler = async (event: APIGatewayProxyEventV2) => {
  const repository = new DynamoDBPurchaseRequestRepository();

  const useCase = new CreatePurchaseRequestUseCase(repository);

  const controller = new CreatePurchaseRequestController(useCase);

  const body = typeof event.body === "string" 
    ? JSON.parse(event.body) 
    : event.body ?? {};

  return controller.execute(body);
};

export const handler = middy(baseHandler).use(errorMiddleware());
