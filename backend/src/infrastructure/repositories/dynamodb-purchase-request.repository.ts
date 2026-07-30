import { GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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
          approvers: request.data.approvers,
          status: request.data.status,
          createdAt: request.data.createdAt.toISOString(),
          ...(request.data.evidenceUrl && { evidenceUrl: request.data.evidenceUrl }),
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
      approvers: result.Item.approvers ?? [],
      status: result.Item.status,
      createdAt: new Date(result.Item.createdAt),
      evidenceUrl: result.Item.evidenceUrl,
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
        approvers: item.approvers ?? [],
        status: item.status,
        createdAt: new Date(item.createdAt),
        evidenceUrl: item.evidenceUrl,
      }),
    );
  }

  async updateStatus(id: string, request: PurchaseRequest): Promise<void> {
    await dynamoDBClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          id,
        },
        UpdateExpression: "SET #status = :status, evidenceUrl = :evidenceUrl",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": request.data.status,
          ":evidenceUrl": request.data.evidenceUrl ?? null,
        },
      }),
    );
  }
}
