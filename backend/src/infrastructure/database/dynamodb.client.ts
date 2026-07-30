import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { env } from "../config/env";

const isLocal = env.nodeEnv === "dev" && process.env.IS_OFFLINE === "true";

export const dynamoDBClient = new DynamoDBClient(
  isLocal
    ? {
        endpoint: "http://localhost:8000",
        region: "localhost",
        credentials: {
          accessKeyId: "fake",
          secretAccessKey: "fake",
        },
      }
    : {
        region: env.awsRegion,
      },
);
