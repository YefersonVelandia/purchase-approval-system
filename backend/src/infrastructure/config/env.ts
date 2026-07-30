export const env = {
  purchaseRequestsTable:
    process.env.PURCHASE_REQUESTS_TABLE ?? "PurchaseRequests",
  approvalsTable:
    process.env.APPROVALS_TABLE ?? "Approvals",
  mockEmailsTable:
    process.env.MOCK_EMAILS_TABLE ?? "MockEmails",
  s3BucketName:
    process.env.S3_BUCKET_NAME ?? "purchase-evidence-bucket",
  awsRegion: process.env.AWS_REGION ?? "us-east-1",
  nodeEnv: process.env.NODE_ENV ?? "dev",
};