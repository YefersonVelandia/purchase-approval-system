import { ListApprovalsUseCase } from "./list-approvals.use-case";
import { Approval, ApprovalStatus } from "../../domain/entities/approval.entity";
import { ApprovalRepository } from "../ports/approval.repository";

describe("ListApprovalsUseCase", () => {
  it("should return approvals by purchase request id", async () => {
    const approvals = [
      Approval.create({
        id: "approval-1",
        purchaseRequestId: "request-123",
        approverId: "manager-001",
        approvalToken: "token-123",
        status: ApprovalStatus.PENDING,
        otpCode: "123456",
        otpExpiresAt: new Date(Date.now() + 180000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    const repository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPurchaseRequestId: jest.fn().mockResolvedValue(approvals),
      update: jest.fn(),
      findByApprovalToken: jest.fn(),
    };

    const useCase = new ListApprovalsUseCase(repository);

    const result = await useCase.execute("request-123");

    expect(repository.findByPurchaseRequestId).toHaveBeenCalledWith("request-123");

    expect(result).toHaveLength(1);
    expect(result[0].approverId).toBe("manager-001");
  });

  it("should return empty list when no approvals exist", async () => {
    const repository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPurchaseRequestId: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
      findByApprovalToken: jest.fn(),
    };

    const useCase = new ListApprovalsUseCase(repository);

    const result = await useCase.execute("request-123");

    expect(result).toEqual([]);
  });
});
