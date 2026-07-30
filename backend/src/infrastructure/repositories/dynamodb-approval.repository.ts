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
          approvalToken: approval.data.approvalToken,
          otpCode: approval.data.otpCode,
          otpExpiresAt: approval.data.otpExpiresAt?.toISOString(),
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
      approvalToken: result.Item.approvalToken,
      otpCode: result.Item.otpCode,
      otpExpiresAt: result.Item.otpExpiresAt ? new Date(result.Item.otpExpiresAt) : undefined,
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
        approvalToken: item.approvalToken,
        otpCode: item.otpCode,
        otpExpiresAt: item.otpExpiresAt ? new Date(item.otpExpiresAt) : undefined,
        status: item.status as ApprovalStatus,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }),
    );
  }

  async update(approval: Approval): Promise<void> {
    await dynamoDBClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          id: approval.id,
        },
        UpdateExpression:
          "SET otpCode = :otpCode, otpExpiresAt = :otpExpiresAt, updatedAt = :updatedAt, #status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":otpCode": approval.data.otpCode,
          ":otpExpiresAt": approval.data.otpExpiresAt?.toISOString(),
          ":updatedAt": approval.data.updatedAt.toISOString(),
          ":status": approval.data.status,
        },
      }),
    );
  }

  async findByApprovalToken(token: string): Promise<Approval | null> {
    const result = await dynamoDBClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: "ApprovalTokenIndex",
        KeyConditionExpression: "approvalToken = :approvalToken",
        ExpressionAttributeValues: {
          ":approvalToken": token,
        },
      }),
    );

    const item = result.Items?.[0];

    if (!item) {
      return null;
    }

    return Approval.create({
      id: item.id,
      purchaseRequestId: item.purchaseRequestId,
      approverId: item.approverId,
      approvalToken: item.approvalToken,
      otpCode: item.otpCode,
      otpExpiresAt: item.otpExpiresAt ? new Date(item.otpExpiresAt) : undefined,
      status: item.status as ApprovalStatus,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    });
  }
}
