import { PurchaseRequest } from "../../domain/entities/purchase-request.entity";

export interface PurchaseRequestRepository {
  save(request: PurchaseRequest): Promise<void>;
  findById(id: string): Promise<PurchaseRequest | null>;
}
