import { Approval } from "../../domain/entities/approval.entity";

export interface ApprovalRepository {
  save(approval: Approval): Promise<void>;

  findById(id: string): Promise<Approval | null>;

  findByPurchaseRequestId(purchaseRequestId: string): Promise<Approval[]>;

  updateStatus(id: string, approval: Approval): Promise<void>;
}
