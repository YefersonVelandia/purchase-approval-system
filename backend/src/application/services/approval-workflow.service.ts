import { randomUUID } from "node:crypto";

import { Approval, ApprovalStatus } from "../../domain/entities/approval.entity";

import { PurchaseRequest } from "../../domain/entities/purchase-request.entity";
import { ApprovalRepository } from "../ports/approval.repository";
import { OtpService } from "./otp.service";

export class ApprovalWorkflowService {
  private readonly otpService = new OtpService();

  constructor(private readonly approvalRepository: ApprovalRepository) {}

  // Crea un Approval por cada aprobador con token único como mecanismo
  // de seguridad para el link de aprobación (aprobador específico)
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
