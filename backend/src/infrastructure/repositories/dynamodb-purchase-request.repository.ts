import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { PurchaseRequestRepository } from "../../application/ports/purchase-request.repository";
import { PurchaseRequest } from "../../domain/entities/purchase-request.entity";

import { dynamoDBClient } from "../database/dynamodb.client";

import { env } from "../config/env";

export class DynamoDBPurchaseRequestRepository implements PurchaseRequestRepository {
  private readonly tableName = env.purchaseRequestsTable;

  async save(request: PurchaseRequest): Promise<void> {
    await dynamoDBClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `REQUEST#${request.id}`,
          SK: "METADATA",
          ...request.data,
          createdAt: request.data.createdAt.toISOString(),
        },
      }),
    );
  }

  async findById(id: string): Promise<PurchaseRequest | null> {
    void id;

    return null;
  }
}
