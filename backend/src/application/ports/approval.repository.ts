import { Approval } from "../../domain/entities/approval.entity";

export interface ApprovalRepository {
  save(approval: Approval): Promise<void>;

  findById(id: string): Promise<Approval | null>;

  findByPurchaseRequestId(purchaseRequestId: string): Promise<Approval[]>;

  findByApprovalToken(token: string): Promise<Approval | null>;

  update(approval: Approval): Promise<void>;
}
