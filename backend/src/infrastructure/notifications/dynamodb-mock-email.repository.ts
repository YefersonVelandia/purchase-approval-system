import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

import { env } from "../config/env";
import { NotificationRepository, MockEmail } from "../../application/ports/notification.repository";
import { dynamoDBClient } from "../database/dynamodb.client";

const TABLE_NAME = env.mockEmailsTable || "MockEmails-dev";

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

export class DynamoDBMockEmailRepository implements NotificationRepository {
  async send(input: { to: string; subject: string; body: string; url?: string }): Promise<void> {
    const email: MockEmail = {
      to: input.to,
      subject: input.subject,
      body: input.body,
      url: input.url,
      sentAt: new Date(),
    };

    await documentClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...email,
          sentAt: email.sentAt.toISOString(),
        },
      }),
    );

    console.log("MOCK EMAIL");
    console.log("----------------");
    console.log("TO:", input.to);
    console.log("SUBJECT:", input.subject);
    console.log(input.body);
    console.log("----------------");
  }

  async list(): Promise<MockEmail[]> {
    const result = await documentClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      }),
    );

    return (
      result.Items?.map((item) => ({
        to: item.to,
        subject: item.subject,
        body: item.body,
        url: item.url,
        sentAt: new Date(item.sentAt),
      })) || []
    );
  }

  async clear(): Promise<void> {
    const result = await documentClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      }),
    );

    for (const item of result.Items || []) {
      await documentClient.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: {
            id: item.id,
          },
        }),
      );
    }
  }
}

// Keep the old file-based implementation for backward compatibility during migration
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const STORAGE_DIR = join(process.cwd(), ".dynamodb");
const STORAGE_FILE = join(STORAGE_DIR, "mock-emails.json");

function loadEmailsFromFile(): MockEmail[] {
  try {
    if (existsSync(STORAGE_FILE)) {
      const raw = readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return parsed.map((e: MockEmail) => ({ ...e, sentAt: new Date(e.sentAt) }));
    }
  } catch {
    // ignore read errors
  }
  return [];
}

function saveEmailsToFile(emails: MockEmail[]): void {
  try {
    if (!existsSync(STORAGE_DIR)) {
      mkdirSync(STORAGE_DIR, { recursive: true });
    }
    writeFileSync(STORAGE_FILE, JSON.stringify(emails, null, 2), "utf-8");
  } catch {
    // ignore write errors
  }
}

export class MockEmailRepository implements NotificationRepository {
  async send(input: { to: string; subject: string; body: string; url?: string }): Promise<void> {
    const email: MockEmail = {
      to: input.to,
      subject: input.subject,
      body: input.body,
      url: input.url,
      sentAt: new Date(),
    };

    const emails = loadEmailsFromFile();
    emails.push(email);
    saveEmailsToFile(emails);

    console.log("MOCK EMAIL");
    console.log("----------------");
    console.log("TO:", input.to);
    console.log("SUBJECT:", input.subject);
    console.log(input.body);
    console.log("----------------");
  }

  async list(): Promise<MockEmail[]> {
    return loadEmailsFromFile();
  }

  async clear(): Promise<void> {
    saveEmailsToFile([]);
  }
}

// Factory to select the appropriate implementation
export function createMockEmailRepository(): NotificationRepository {
  // Use DynamoDB in production or when IS_OFFLINE is not set (AWS Lambda)
  // Use file system in local development with serverless-offline
  const isLocalDev = env.nodeEnv === "dev" && process.env.IS_OFFLINE === "true";
  
  if (isLocalDev) {
    console.log("Using file-based MockEmailRepository for local development");
    return new MockEmailRepository();
  } else {
    console.log("Using DynamoDB-based MockEmailRepository for production");
    return new DynamoDBMockEmailRepository();
  }
}
