import { StorageRepository } from "../../application/ports/storage.repository";
import { MockStorageRepository } from "./mock-storage.repository";
import { S3StorageRepository } from "./s3-storage.repository";
import { env } from "../config/env";

// Estrategia: en dev/test se usa almacenamiento en memoria (Mock)
// para evitar dependencia AWS; en producción se usa S3 real
export function getStorageRepository(): StorageRepository {
  if (env.nodeEnv === "dev" || env.nodeEnv === "test") {
    return new MockStorageRepository();
  }

  return new S3StorageRepository();
}
