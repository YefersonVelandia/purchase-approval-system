import { CreatePurchaseRequestUseCase } from "./create-purchase-request.use-case";
import { PurchaseRequestRepository } from "../ports/purchase-request.repository";
import { ApprovalRepository } from "../ports/approval.repository";
import { ApproverRole } from "../../domain/entities/purchase-request.entity";

describe("CreatePurchaseRequestUseCase", () => {
  it("should create a purchase request and generate three approvals", async () => {
    const purchaseRequestRepository: PurchaseRequestRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    const approvalRepository: ApprovalRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByPurchaseRequestId: jest.fn().mockResolvedValue([
        {
          data: {
            approverId: "juan@empresa.com",
            approvalToken: "token-juan",
          },
        },
        {
          data: {
            approverId: "maria@empresa.com",
            approvalToken: "token-maria",
          },
        },
        {
          data: {
            approverId: "carlos@empresa.com",
            approvalToken: "token-carlos",
          },
        },
      ]),
      update: jest.fn(),
      findByApprovalToken: jest.fn(),
    };

    const notificationRepository = {
      send: jest.fn(),
      list: jest.fn(),
      clear: jest.fn(),
    };

    const useCase = new CreatePurchaseRequestUseCase(
      purchaseRequestRepository,
      approvalRepository,
      notificationRepository,
    );

    const result = await useCase.execute({
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
    });

    expect(result.data.status).toBe("PENDING");

    expect(purchaseRequestRepository.save).toHaveBeenCalledTimes(1);

    expect(approvalRepository.save).toHaveBeenCalledTimes(3);

    expect(notificationRepository.send).toHaveBeenCalledTimes(3);
  });
});
