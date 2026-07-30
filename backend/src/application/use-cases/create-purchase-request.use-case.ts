import { randomUUID } from "node:crypto";

import {
  PurchaseRequest,
  PurchaseRequestStatus,
} from "../../domain/entities/purchase-request.entity";

import { PurchaseRequestRepository } from "../ports/purchase-request.repository";
import { ApprovalRepository } from "../ports/approval.repository";

import { CreatePurchaseRequestDto } from "../dto/create-purchase-request.dto";
import { ApprovalWorkflowService } from "../services/approval-workflow.service";
import { ApprovalNotificationService } from "../services/approval-notification.service";
import { NotificationRepository } from "../ports/notification.repository";

export class CreatePurchaseRequestUseCase {
  private readonly approvalWorkflowService: ApprovalWorkflowService;
  private readonly approvalNotificationService: ApprovalNotificationService;

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly approvalRepository: ApprovalRepository,
    notificationRepository: NotificationRepository,
  ) {
    this.approvalWorkflowService = new ApprovalWorkflowService(this.approvalRepository);

    this.approvalNotificationService = new ApprovalNotificationService(
      this.approvalRepository,
      notificationRepository,
    );
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

    await this.approvalNotificationService.notify(purchaseRequest);

    return purchaseRequest;
  }
}
