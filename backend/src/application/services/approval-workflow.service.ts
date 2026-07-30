import { randomUUID } from "node:crypto";

import { Approval, ApprovalStatus } from "../../domain/entities/approval.entity";

import { PurchaseRequest } from "../../domain/entities/purchase-request.entity";
import { ApprovalRepository } from "../ports/approval.repository";

export class ApprovalWorkflowService {
  constructor(private readonly approvalRepository: ApprovalRepository) {}

  async initialize(purchaseRequest: PurchaseRequest): Promise<void> {
    for (const approver of purchaseRequest.data.approvers) {
      const approval = Approval.create({
        id: randomUUID(),
        purchaseRequestId: purchaseRequest.id,
        approverId: approver.email,
        approvalToken: randomUUID(),
        status: ApprovalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.approvalRepository.save(approval);
    }
  }
}
