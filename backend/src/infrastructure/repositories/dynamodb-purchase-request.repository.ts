import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
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
          id: request.id,
          title: request.data.title,
          description: request.data.description,
          amount: request.data.amount,
          requesterId: request.data.requesterId,
          status: request.data.status,
          createdAt: request.data.createdAt.toISOString(),
        },
      }),
    );
  }

  async findById(id: string): Promise<PurchaseRequest | null> {
    const result = await dynamoDBClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          id,
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    return PurchaseRequest.create({
      id: result.Item.id,
      title: result.Item.title,
      description: result.Item.description,
      amount: result.Item.amount,
      requesterId: result.Item.requesterId,
      status: result.Item.status,
      createdAt: new Date(result.Item.createdAt),
    });
  }

  async findAll(): Promise<PurchaseRequest[]> {
    const result = await dynamoDBClient.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    return (result.Items ?? []).map((item) =>
      PurchaseRequest.create({
        id: item.id,
        title: item.title,
        description: item.description,
        amount: item.amount,
        requesterId: item.requesterId,
        status: item.status,
        createdAt: new Date(item.createdAt),
      }),
    );
  }
}
