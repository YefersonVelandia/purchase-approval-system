import { ApprovalStatus } from "../../domain/entities/approval.entity";

import { ApprovalRepository } from "../ports/approval.repository";
import { PurchaseRequestRepository } from "../ports/purchase-request.repository";

import { EvaluatePurchaseRequestApprovalUseCase } from "./evaluate-purchase-request-approval.use-case";

interface UpdateApprovalStatusInput {
  id: string;
  status: ApprovalStatus;
}

export class UpdateApprovalStatusUseCase {
  private readonly evaluator: EvaluatePurchaseRequestApprovalUseCase;

  constructor(
    private readonly approvalRepository: ApprovalRepository,
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
  ) {
    this.evaluator = new EvaluatePurchaseRequestApprovalUseCase(
      approvalRepository,
      purchaseRequestRepository,
    );
  }

  async execute(input: UpdateApprovalStatusInput) {
    const approval = await this.approvalRepository.findById(input.id);

    if (!approval) {
      throw new Error("Approval not found");
    }

    const updatedApproval = approval.changeStatus(input.status);

    await this.approvalRepository.updateStatus(input.id, updatedApproval);

    await this.evaluator.execute({
      purchaseRequestId: updatedApproval.data.purchaseRequestId,
    });

    return updatedApproval.data;
  }
}
