import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  endpoint: "http://localhost:8000",
  region: "localhost",
  credentials: { accessKeyId: "fake", secretAccessKey: "fake" },
});

const tables = [
  {
    TableName: "PurchaseRequests-dev",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    BillingMode: "PAY_PER_REQUEST",
  },
  {
    TableName: "Approvals-dev",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" },
      { AttributeName: "purchaseRequestId", AttributeType: "S" },
      { AttributeName: "approvalToken", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "PurchaseRequestIndex",
        KeySchema: [{ AttributeName: "purchaseRequestId", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
      },
      {
        IndexName: "ApprovalTokenIndex",
        KeySchema: [{ AttributeName: "approvalToken", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  },
];

for (const table of tables) {
  try {
    await client.send(new CreateTableCommand(table));
    console.log(`Tabla creada: ${table.TableName}`);
  } catch (err) {
    if (err.name === "ResourceInUseException") {
      console.log(`Tabla ya existe: ${table.TableName}`);
    } else {
      console.error(`Error creando ${table.TableName}:`, err.message);
    }
  }
}
