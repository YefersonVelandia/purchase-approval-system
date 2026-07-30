import { ApprovalStatus } from "../../domain/entities/approval.entity";

import { PurchaseRequestStatus } from "../../domain/entities/purchase-request.entity";

import { ApprovalRepository } from "../ports/approval.repository";
import { PurchaseRequestRepository } from "../ports/purchase-request.repository";

interface EvaluatePurchaseRequestApprovalInput {
  purchaseRequestId: string;
}

export class EvaluatePurchaseRequestApprovalUseCase {
  constructor(
    private readonly approvalRepository: ApprovalRepository,
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
  ) {}

  // Evalúa el estado consolidado de todas las aprobaciones para determinar
  // la transición de la solicitud: si alguna rechaza -> REJECTED,
  // si todas aprueban -> COMPLETED, si hay mixto -> se mantiene
  async execute(input: EvaluatePurchaseRequestApprovalInput) {
    const approvals = await this.approvalRepository.findByPurchaseRequestId(
      input.purchaseRequestId,
    );

    if (approvals.length === 0) {
      throw new Error("No approvals found");
    }

    let newStatus: PurchaseRequestStatus | null = null;

    const hasRejected = approvals.some(
      (approval) => approval.data.status === ApprovalStatus.REJECTED,
    );

    const allApproved = approvals.every(
      (approval) => approval.data.status === ApprovalStatus.APPROVED,
    );

    if (hasRejected) {
      newStatus = PurchaseRequestStatus.REJECTED;
    }

    if (allApproved) {
      newStatus = PurchaseRequestStatus.COMPLETED;
    }

    if (!newStatus) {
      return null;
    }

    const purchaseRequest = await this.purchaseRequestRepository.findById(input.purchaseRequestId);

    if (!purchaseRequest) {
      throw new Error("Purchase request not found");
    }

    const updatedRequest = purchaseRequest.changeStatus(newStatus);

    await this.purchaseRequestRepository.updateStatus(input.purchaseRequestId, updatedRequest);

    return updatedRequest.data;
  }
}
