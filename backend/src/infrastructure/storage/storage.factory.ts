import { StorageRepository } from "../../application/ports/storage.repository";
import { MockStorageRepository } from "./mock-storage.repository";
import { S3StorageRepository } from "./s3-storage.repository";
import { env } from "../config/env";

export function getStorageRepository(): StorageRepository {
  if (env.nodeEnv === "dev" || env.nodeEnv === "test") {
    return new MockStorageRepository();
  }

  return new S3StorageRepository();
}
