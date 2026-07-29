import { Approval, ApprovalStatus } from "../../domain/entities/approval.entity";

import { UpdateApprovalStatusUseCase } from "./update-approval-status.use-case";
import { ApprovalRepository } from "../ports/approval.repository";

describe("UpdateApprovalStatusUseCase", () => {
  it("should update approval status to APPROVED", async () => {
    const approval = Approval.create({
      id: "approval-123",
      purchaseRequestId: "request-123",
      approverId: "manager-001",
      status: ApprovalStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(approval),
      findByPurchaseRequestId: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new UpdateApprovalStatusUseCase(repository);

    const result = await useCase.execute({
      id: "approval-123",
      status: ApprovalStatus.APPROVED,
    });

    expect(result.status).toBe(ApprovalStatus.APPROVED);

    expect(repository.updateStatus).toHaveBeenCalled();
  });

  it("should reject update when approval does not exist", async () => {
    const repository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      findByPurchaseRequestId: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new UpdateApprovalStatusUseCase(repository);

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
      status: ApprovalStatus.APPROVED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(approval),
      findByPurchaseRequestId: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new UpdateApprovalStatusUseCase(repository);

    await expect(
      useCase.execute({
        id: "approval-123",
        status: ApprovalStatus.PENDING,
      }),
    ).rejects.toThrow("Cannot change approval status from APPROVED to PENDING");
  });
});
