import { ApprovalStatus } from "../../domain/entities/approval.entity";

import { ApprovalRepository } from "../ports/approval.repository";
import { PurchaseRequestRepository } from "../ports/purchase-request.repository";

import { EvaluatePurchaseRequestApprovalUseCase } from "./evaluate-purchase-request-approval.use-case";
import { GenerateEvidencePdfUseCase } from "./generate-evidence-pdf.use-case";

interface UpdateApprovalStatusInput {
  id: string;
  status: ApprovalStatus;
  signedBy?: string;
}

export class UpdateApprovalStatusUseCase {
  private readonly evaluator: EvaluatePurchaseRequestApprovalUseCase;

  constructor(
    private readonly approvalRepository: ApprovalRepository,
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly evidencePdfUseCase?: GenerateEvidencePdfUseCase,
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

    const updatedApproval = approval.changeStatus(input.status, input.signedBy);

    await this.approvalRepository.update(updatedApproval);

    // Si es la tercera firna (todas APPROVED), se gatilla la generación
    // del PDF de evidencia y se actualiza la URL en la solicitud
    const result = await this.evaluator.execute({
      purchaseRequestId: updatedApproval.data.purchaseRequestId,
    });

    if (result?.status === "COMPLETED" && this.evidencePdfUseCase) {
      const url = await this.evidencePdfUseCase.execute({
        purchaseRequestId: updatedApproval.data.purchaseRequestId,
      });

      const pr = await this.purchaseRequestRepository.findById(
        updatedApproval.data.purchaseRequestId,
      );

      if (pr) {
        const updatedPr = pr.setEvidenceUrl(url);
        await this.purchaseRequestRepository.updateStatus(pr.id, updatedPr);
      }
    }

    return updatedApproval.data;
  }
}
