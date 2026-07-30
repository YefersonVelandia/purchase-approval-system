import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import ApprovalDetail from "../components/ApprovalDetail";
import type { PurchaseRequest } from "../types/approval.types";

const mockRequest: PurchaseRequest = {
  id: "123",
  title: "Test Request",
  description: "Test description",
  amount: 2500,
  requesterId: "user-001",
  status: "PENDING",
  createdAt: "2026-07-30T10:00:00Z",
  approvers: [],
};

describe("ApprovalDetail", () => {
  it("renders request information", () => {
    render(<ApprovalDetail request={mockRequest} />);
    expect(screen.getByText("Test Request")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("user-001")).toBeInTheDocument();
  });

  it("renders amount in currency format", () => {
    render(<ApprovalDetail request={mockRequest} />);
    expect(screen.getByText(/2\.?500/)).toBeInTheDocument();
  });

  it("renders status badge with Pending label", () => {
    render(<ApprovalDetail request={mockRequest} />);
    expect(screen.getAllByText("Pendiente").length).toBe(2);
  });
});
