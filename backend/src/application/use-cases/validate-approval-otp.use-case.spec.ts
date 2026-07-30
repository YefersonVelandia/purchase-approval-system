import { Approval, ApprovalStatus } from "../../domain/entities/approval.entity";

import { ValidateApprovalOtpUseCase } from "./validate-approval-otp.use-case";
import { ApprovalRepository } from "../ports/approval.repository";

describe("ValidateApprovalOtpUseCase", () => {
  it("should validate a correct OTP", async () => {
    const approval = Approval.create({
      id: "approval-123",
      purchaseRequestId: "request-123",
      approverId: "juan@test.com",
      approvalToken: "token-123",
      otpCode: "123456",
      otpExpiresAt: new Date(Date.now() + 180000),
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

    const useCase = new ValidateApprovalOtpUseCase(repository);

    const result = await useCase.execute({
      approvalToken: "token-123",
      otpCode: "123456",
    });

    expect(result.approvalId).toBe("approval-123");
  });

  it("should reject invalid OTP", async () => {
    const approval = Approval.create({
      id: "approval-123",
      purchaseRequestId: "request-123",
      approverId: "juan@test.com",
      approvalToken: "token-123",
      otpCode: "123456",
      otpExpiresAt: new Date(Date.now() + 180000),
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

    const useCase = new ValidateApprovalOtpUseCase(repository);

    await expect(
      useCase.execute({
        approvalToken: "token-123",
        otpCode: "999999",
      }),
    ).rejects.toThrow("Invalid or expired OTP");
  });
});
