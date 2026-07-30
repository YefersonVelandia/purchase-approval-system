import { randomUUID } from "node:crypto";

import {
  PurchaseRequest,
  PurchaseRequestStatus,
} from "../../domain/entities/purchase-request.entity";

import { PurchaseRequestRepository } from "../ports/purchase-request.repository";
import { ApprovalRepository } from "../ports/approval.repository";

import { CreatePurchaseRequestDto } from "../dto/create-purchase-request.dto";
import { ApprovalWorkflowService } from "../services/approval-workflow.service";

export class CreatePurchaseRequestUseCase {
  private readonly approvalWorkflowService: ApprovalWorkflowService;

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly approvalRepository: ApprovalRepository,
  ) {
    this.approvalWorkflowService = new ApprovalWorkflowService(this.approvalRepository);
  }

  async execute(input: CreatePurchaseRequestDto): Promise<PurchaseRequest> {
    const purchaseRequest = PurchaseRequest.create({
      id: randomUUID(),
      title: input.title,
      description: input.description,
      amount: input.amount,
      requesterId: input.requesterId,
      approvers: input.approvers,
      status: PurchaseRequestStatus.PENDING,
      createdAt: new Date(),
    });

    await this.purchaseRequestRepository.save(purchaseRequest);

    await this.approvalWorkflowService.initialize(purchaseRequest);

    return purchaseRequest;
  }
}
