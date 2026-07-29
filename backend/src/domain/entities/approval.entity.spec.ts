import { Approval, ApprovalStatus } from "./approval.entity";

describe("Approval entity", () => {
  const createApproval = (status: ApprovalStatus) =>
    Approval.create({
      id: "approval-123",
      purchaseRequestId: "request-123",
      approverId: "approver-123",
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  it("should allow PENDING to APPROVED transition", () => {
    const approval = createApproval(ApprovalStatus.PENDING);

    const updated = approval.changeStatus(ApprovalStatus.APPROVED);

    expect(updated.data.status).toBe(ApprovalStatus.APPROVED);
  });

  it("should allow PENDING to REJECTED transition", () => {
    const approval = createApproval(ApprovalStatus.PENDING);

    const updated = approval.changeStatus(ApprovalStatus.REJECTED);

    expect(updated.data.status).toBe(ApprovalStatus.REJECTED);
  });

  it("should reject APPROVED to PENDING transition", () => {
    const approval = createApproval(ApprovalStatus.APPROVED);

    expect(() => approval.changeStatus(ApprovalStatus.PENDING)).toThrow(
      "Cannot change approval status from APPROVED to PENDING",
    );
  });

  it("should reject REJECTED to APPROVED transition", () => {
    const approval = createApproval(ApprovalStatus.REJECTED);

    expect(() => approval.changeStatus(ApprovalStatus.APPROVED)).toThrow(
      "Cannot change approval status from REJECTED to APPROVED",
    );
  });

  it("should allow changing to the same status", () => {
    const approval = createApproval(ApprovalStatus.APPROVED);

    const updated = approval.changeStatus(ApprovalStatus.APPROVED);

    expect(updated.data.status).toBe(ApprovalStatus.APPROVED);
  });

  it("should require purchase request id", () => {
    expect(() =>
      Approval.create({
        id: "approval-123",
        purchaseRequestId: "",
        approverId: "approver-123",
        status: ApprovalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ).toThrow("Purchase request id is required");
  });

  it("should require approver id", () => {
    expect(() =>
      Approval.create({
        id: "approval-123",
        purchaseRequestId: "request-123",
        approverId: "",
        status: ApprovalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ).toThrow("Approver id is required");
  });
});
