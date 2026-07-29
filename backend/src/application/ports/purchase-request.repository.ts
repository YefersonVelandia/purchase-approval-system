import { PurchaseRequest, PurchaseRequestStatus } from "../../domain/entities/purchase-request.entity";

export interface PurchaseRequestRepository {
  save(request: PurchaseRequest): Promise<void>;
  findById(id: string): Promise<PurchaseRequest | null>;
  findAll(): Promise<PurchaseRequest[]>;
  updateStatus(id: string, status: PurchaseRequestStatus): Promise<PurchaseRequest | null>;
}
