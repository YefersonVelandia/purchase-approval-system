import { PurchaseRequest, PurchaseRequestStatus } from "./purchase-request.entity";

describe("PurchaseRequest entity", () => {
  const createRequest = (status: PurchaseRequestStatus) =>
    PurchaseRequest.create({
      id: "request-123",
      title: "Laptop",
      description: "Developer laptop",
      amount: 1500,
      requesterId: "user-123",
      status,
      createdAt: new Date(),
    });

  it("should allow PENDING to SIGNED transition", () => {
    const request = createRequest(PurchaseRequestStatus.PENDING);

    const updated = request.changeStatus(PurchaseRequestStatus.SIGNED);

    expect(updated.data.status).toBe(PurchaseRequestStatus.SIGNED);
  });

  it("should allow PENDING to REJECTED transition", () => {
    const request = createRequest(PurchaseRequestStatus.PENDING);

    const updated = request.changeStatus(PurchaseRequestStatus.REJECTED);

    expect(updated.data.status).toBe(PurchaseRequestStatus.REJECTED);
  });

  it("should allow SIGNED to COMPLETED transition", () => {
    const request = createRequest(PurchaseRequestStatus.SIGNED);

    const updated = request.changeStatus(PurchaseRequestStatus.COMPLETED);

    expect(updated.data.status).toBe(PurchaseRequestStatus.COMPLETED);
  });

  it("should reject SIGNED to PENDING transition", () => {
    const request = createRequest(PurchaseRequestStatus.SIGNED);

    expect(() => request.changeStatus(PurchaseRequestStatus.PENDING)).toThrow(
      "Cannot change status from SIGNED to PENDING",
    );
  });

  it("should reject COMPLETED to PENDING transition", () => {
    const request = createRequest(PurchaseRequestStatus.COMPLETED);

    expect(() => request.changeStatus(PurchaseRequestStatus.PENDING)).toThrow(
      "Cannot change status from COMPLETED to PENDING",
    );
  });

  it("should allow changing to the same status", () => {
    const request = createRequest(PurchaseRequestStatus.SIGNED);

    const updated = request.changeStatus(PurchaseRequestStatus.SIGNED);

    expect(updated.data.status).toBe(PurchaseRequestStatus.SIGNED);
  });
});
