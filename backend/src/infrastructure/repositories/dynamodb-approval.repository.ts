import { PutCommand, QueryCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { Approval, ApprovalStatus } from "../../domain/entities/approval.entity";

import { ApprovalRepository } from "../../application/ports/approval.repository";
import { dynamoDBClient } from "../database/dynamodb.client";

export class DynamoDBApprovalRepository implements ApprovalRepository {
  private readonly tableName = "Approvals";

  async save(approval: Approval): Promise<void> {
    await dynamoDBClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          id: approval.id,
          purchaseRequestId: approval.data.purchaseRequestId,
          approverId: approval.data.approverId,
          status: approval.data.status,
          createdAt: approval.data.createdAt.toISOString(),
          updatedAt: approval.data.updatedAt.toISOString(),
        },
      }),
    );
  }

  async findById(id: string): Promise<Approval | null> {
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

    return Approval.create({
      id: result.Item.id,
      purchaseRequestId: result.Item.purchaseRequestId,
      approverId: result.Item.approverId,
      status: result.Item.status as ApprovalStatus,
      createdAt: new Date(result.Item.createdAt),
      updatedAt: new Date(result.Item.updatedAt),
    });
  }

  async findByPurchaseRequestId(purchaseRequestId: string): Promise<Approval[]> {
    const result = await dynamoDBClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: "PurchaseRequestIndex",
        KeyConditionExpression: "purchaseRequestId = :purchaseRequestId",
        ExpressionAttributeValues: {
          ":purchaseRequestId": purchaseRequestId,
        },
      }),
    );

    return (result.Items ?? []).map((item) =>
      Approval.create({
        id: item.id,
        purchaseRequestId: item.purchaseRequestId,
        approverId: item.approverId,
        status: item.status as ApprovalStatus,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }),
    );
  }

  async updateStatus(id: string, approval: Approval): Promise<void> {
    await dynamoDBClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          id,
        },
        UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": approval.data.status,
          ":updatedAt": approval.data.updatedAt.toISOString(),
        },
      }),
    );
  }
}
