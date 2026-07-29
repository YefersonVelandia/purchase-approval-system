export const env = {
  purchaseRequestsTable:
    process.env.PURCHASE_REQUESTS_TABLE ?? "PurchaseRequests",
  awsRegion: process.env.AWS_REGION ?? "us-east-1",
};