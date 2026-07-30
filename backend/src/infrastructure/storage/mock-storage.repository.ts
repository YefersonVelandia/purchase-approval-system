import { StorageRepository } from "../../application/ports/storage.repository";

export class MockStorageRepository implements StorageRepository {
  private static storage: Map<string, { content: Buffer; contentType: string }> = new Map();

  async upload(key: string, content: Buffer, contentType: string): Promise<string> {
    MockStorageRepository.storage.set(key, { content, contentType });
    return `mock-url/${key}`;
  }

  async download(key: string): Promise<Buffer | null> {
    const item = MockStorageRepository.storage.get(key);
    return item ? item.content : null;
  }

  static clear(): void {
    MockStorageRepository.storage.clear();
  }
}
