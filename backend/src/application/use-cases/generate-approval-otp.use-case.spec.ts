import { Approval, ApprovalStatus } from "../../domain/entities/approval.entity";
import { GenerateApprovalOtpUseCase } from "./generate-approval-otp.use-case";
import { ApprovalRepository } from "../ports/approval.repository";

describe("GenerateApprovalOtpUseCase", () => {
  it("should generate and save an OTP for an approval", async () => {
    const approval = Approval.create({
      id: "approval-123",
      purchaseRequestId: "request-123",
      approverId: "manager@test.com",
      approvalToken: "token-123",
      status: ApprovalStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPurchaseRequestId: jest.fn(),
      findByApprovalToken: jest.fn().mockResolvedValue(approval),
      update: jest.fn(),
    };

    const useCase = new GenerateApprovalOtpUseCase(repository);

    const result = await useCase.execute({
      approvalToken: "token-123",
    });

    expect(result.approvalId).toBe("approval-123");

    expect(repository.update).toHaveBeenCalled();
  });

  it("should reject when approval does not exist", async () => {
    const repository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPurchaseRequestId: jest.fn(),
      findByApprovalToken: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
    };

    const useCase = new GenerateApprovalOtpUseCase(repository);

    await expect(
      useCase.execute({
        approvalToken: "invalid-token",
      }),
    ).rejects.toThrow("Approval not found");
  });
});
