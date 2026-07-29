import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { env } from "../config/env";

export const dynamoDBClient = new DynamoDBClient({
  region: env.awsRegion,
});
