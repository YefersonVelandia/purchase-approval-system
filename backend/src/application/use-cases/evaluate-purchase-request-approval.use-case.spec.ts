import { Approval, ApprovalStatus } from "../../domain/entities/approval.entity";

import {
  PurchaseRequest,
  PurchaseRequestStatus,
  ApproverRole,
} from "../../domain/entities/purchase-request.entity";

import { EvaluatePurchaseRequestApprovalUseCase } from "./evaluate-purchase-request-approval.use-case";

import { ApprovalRepository } from "../ports/approval.repository";
import { PurchaseRequestRepository } from "../ports/purchase-request.repository";

describe("EvaluatePurchaseRequestApprovalUseCase", () => {
  const purchaseRequest = PurchaseRequest.create({
    id: "request-123",
    title: "Laptop",
    description: "Developer laptop",
    amount: 1500,
    requesterId: "user-123",
    approvers: [
      { name: "Juan Perez", email: "manager-1", role: ApproverRole.MANAGER },
      { name: "Maria Gomez", email: "manager-2", role: ApproverRole.FINANCE },
      { name: "Carlos Ruiz", email: "manager-3", role: ApproverRole.LEGAL },
    ],
    status: PurchaseRequestStatus.PENDING,
    createdAt: new Date(),
  });

  it("should change purchase request to SIGNED when all approvals are approved", async () => {
    const approvals = [
      Approval.create({
        id: "approval-1",
        purchaseRequestId: "request-123",
        approverId: "manager-1",
        approvalToken: "token-1",
        status: ApprovalStatus.APPROVED,
        otpCode: "123456",
        otpExpiresAt: new Date(Date.now() + 180000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Approval.create({
        id: "approval-2",
        purchaseRequestId: "request-123",
        approverId: "manager-2",
        approvalToken: "token-2",
        status: ApprovalStatus.APPROVED,
        otpCode: "123456",
        otpExpiresAt: new Date(Date.now() + 180000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Approval.create({
        id: "approval-3",
        purchaseRequestId: "request-123",
        approverId: "manager-3",
        approvalToken: "token-3",
        status: ApprovalStatus.APPROVED,
        otpCode: "123456",
        otpExpiresAt: new Date(Date.now() + 180000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    const approvalRepository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPurchaseRequestId: jest.fn().mockResolvedValue(approvals),
      updateStatus: jest.fn(),
    };

    const requestRepository: PurchaseRequestRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(purchaseRequest),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new EvaluatePurchaseRequestApprovalUseCase(
      approvalRepository,
      requestRepository,
    );

    const result = await useCase.execute({
      purchaseRequestId: "request-123",
    });

    expect(result?.status).toBe(PurchaseRequestStatus.SIGNED);

    expect(requestRepository.updateStatus).toHaveBeenCalled();
  });

  it("should change purchase request to REJECTED when an approval is rejected", async () => {
    const approvals = [
      Approval.create({
        id: "approval-1",
        purchaseRequestId: "request-123",
        approverId: "manager-1",
        approvalToken: "token-1",
        status: ApprovalStatus.APPROVED,
        otpCode: "123456",
        otpExpiresAt: new Date(Date.now() + 180000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Approval.create({
        id: "approval-2",
        purchaseRequestId: "request-123",
        approverId: "manager-2",
        approvalToken: "token-2",
        status: ApprovalStatus.REJECTED,
        otpCode: "123456",
        otpExpiresAt: new Date(Date.now() + 180000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Approval.create({
        id: "approval-3",
        purchaseRequestId: "request-123",
        approverId: "manager-3",
        approvalToken: "token-3",
        status: ApprovalStatus.APPROVED,
        otpCode: "123456",
        otpExpiresAt: new Date(Date.now() + 180000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    const approvalRepository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPurchaseRequestId: jest.fn().mockResolvedValue(approvals),
      updateStatus: jest.fn(),
    };

    const requestRepository: PurchaseRequestRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(purchaseRequest),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new EvaluatePurchaseRequestApprovalUseCase(
      approvalRepository,
      requestRepository,
    );

    const result = await useCase.execute({
      purchaseRequestId: "request-123",
    });

    expect(result?.status).toBe(PurchaseRequestStatus.REJECTED);
  });

  it("should not update purchase request when approvals are still pending", async () => {
    const approvals = [
      Approval.create({
        id: "approval-1",
        purchaseRequestId: "request-123",
        approverId: "manager-1",
        approvalToken: "token-1",
        status: ApprovalStatus.PENDING,
        otpCode: "123456",
        otpExpiresAt: new Date(Date.now() + 180000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    const approvalRepository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPurchaseRequestId: jest.fn().mockResolvedValue(approvals),
      updateStatus: jest.fn(),
    };

    const requestRepository: PurchaseRequestRepository = {
      save: jest.fn(),
      findById: jest.fn().mockResolvedValue(purchaseRequest),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    const useCase = new EvaluatePurchaseRequestApprovalUseCase(
      approvalRepository,
      requestRepository,
    );

    const result = await useCase.execute({
      purchaseRequestId: "request-123",
    });

    expect(result).toBeNull();

    expect(requestRepository.updateStatus).not.toHaveBeenCalled();
  });
});
