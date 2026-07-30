export interface StorageRepository {
  upload(key: string, content: Buffer, contentType: string): Promise<string>;
  download(key: string): Promise<Buffer | null>;
}
