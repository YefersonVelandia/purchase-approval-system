import { Approval, ApprovalStatus } from "../../domain/entities/approval.entity";

import {
  PurchaseRequest,
  PurchaseRequestStatus,
  ApproverRole,
} from "../../domain/entities/purchase-request.entity";

import { UpdateApprovalStatusUseCase } from "./update-approval-status.use-case";

import { ApprovalRepository } from "../ports/approval.repository";
import { PurchaseRequestRepository } from "../ports/purchase-request.repository";

describe("UpdateApprovalStatusUseCase", () => {
  it("should update approval status to APPROVED", async () => {
    const approval = Approval.create({
      id: "approval-123",
      purchaseRequestId: "request-123",
      approverId: "manager-001",
      approvalToken: "token-123",
      status: ApprovalStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const purchaseRequest = PurchaseRequest.create({
      id: "request-123",
      title: "Laptop",
      description: "Developer laptop",
      amount: 1500,
      requesterId: "user-123",
      approvers: [
        {
          name: "Juan Perez",
          email: "juan@empresa.com",
          role: ApproverRole.MANAGER,
        },
        {
          name: "Maria Gomez",
          email: "maria@empresa.com",
          role: ApproverRole.FINANCE,
        },
        {
          name: "Carlos Ruiz",
          email: "carlos@empresa.com",
          role: ApproverRole.LEGAL,
        },
      ],
      status: PurchaseRequestStatus.PENDING,
      createdAt: new Date(),
    });

    const approvalRepository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(approval),
      findByPurchaseRequestId: jest.fn().mockResolvedValue([approval]),
      updateStatus: jest.fn(),
    };

    const purchaseRequestRepository: PurchaseRequestRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(purchaseRequest),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new UpdateApprovalStatusUseCase(approvalRepository, purchaseRequestRepository);

    const result = await useCase.execute({
      id: "approval-123",
      status: ApprovalStatus.APPROVED,
    });

    expect(result.status).toBe(ApprovalStatus.APPROVED);

    expect(approvalRepository.updateStatus).toHaveBeenCalled();

    expect(purchaseRequestRepository.updateStatus).not.toHaveBeenCalled();
  });

  it("should reject update when approval does not exist", async () => {
    const approvalRepository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      findByPurchaseRequestId: jest.fn(),
      updateStatus: jest.fn(),
    };

    const purchaseRequestRepository: PurchaseRequestRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new UpdateApprovalStatusUseCase(approvalRepository, purchaseRequestRepository);

    await expect(
      useCase.execute({
        id: "approval-123",
        status: ApprovalStatus.APPROVED,
      }),
    ).rejects.toThrow("Approval not found");
  });

  it("should reject invalid status transition", async () => {
    const approval = Approval.create({
      id: "approval-123",
      purchaseRequestId: "request-123",
      approverId: "manager-001",
      approvalToken: "token-123",
      status: ApprovalStatus.APPROVED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const approvalRepository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(approval),
      findByPurchaseRequestId: jest.fn().mockResolvedValue([approval]),
      updateStatus: jest.fn(),
    };

    const purchaseRequestRepository: PurchaseRequestRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new UpdateApprovalStatusUseCase(approvalRepository, purchaseRequestRepository);

    await expect(
      useCase.execute({
        id: "approval-123",
        status: ApprovalStatus.PENDING,
      }),
    ).rejects.toThrow("Cannot change approval status from APPROVED to PENDING");
  });
});
