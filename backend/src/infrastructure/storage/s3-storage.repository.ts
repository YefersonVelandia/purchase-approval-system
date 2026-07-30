import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

import { StorageRepository } from "../../application/ports/storage.repository";
import { env } from "../config/env";

const s3Client = new S3Client({ region: env.awsRegion });

export class S3StorageRepository implements StorageRepository {
  private readonly bucketName = env.s3BucketName;

  async upload(key: string, content: Buffer, contentType: string): Promise<string> {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: content,
        ContentType: contentType,
      }),
    );

    return `https://${this.bucketName}.s3.${env.awsRegion}.amazonaws.com/${key}`;
  }

  async download(key: string): Promise<Buffer | null> {
    try {
      const response = await s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );

      if (!response.Body) {
        return null;
      }

      const chunks: Uint8Array[] = [];
      const stream = response.Body as any;

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error("Error downloading from S3:", error);
      return null;
    }
  }
}
