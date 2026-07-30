import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ApprovalActions from "../components/ApprovalActions";

describe("ApprovalActions", () => {
  const mockApprove = jest.fn();
  const mockReject = jest.fn();

  beforeEach(() => {
    mockApprove.mockClear();
    mockReject.mockClear();
  });

  it("renders approve and reject buttons", () => {
    render(<ApprovalActions onApprove={mockApprove} onReject={mockReject} />);
    expect(screen.getByRole("button", { name: "Aprobar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rechazar" })).toBeInTheDocument();
  });

  it("renders signed by input with initial value", () => {
    render(
      <ApprovalActions onApprove={mockApprove} onReject={mockReject} approverName="Juan Perez" />,
    );
    const input = screen.getByLabelText("Firmado por") as HTMLInputElement;
    expect(input.value).toBe("Juan Perez");
  });

  it("disables buttons when signedBy is empty", () => {
    render(<ApprovalActions onApprove={mockApprove} onReject={mockReject} approverName="" />);
    expect(screen.getByRole("button", { name: "Aprobar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Rechazar" })).toBeDisabled();
  });

  it("calls onApprove when approve button is clicked", () => {
    mockApprove.mockResolvedValue(undefined);
    render(
      <ApprovalActions onApprove={mockApprove} onReject={mockReject} approverName="Juan" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Aprobar" }));
    expect(mockApprove).toHaveBeenCalledWith("Juan");
  });

  it("calls onReject when reject button is clicked", () => {
    mockReject.mockResolvedValue(undefined);
    render(
      <ApprovalActions onApprove={mockApprove} onReject={mockReject} approverName="Maria" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Rechazar" }));
    expect(mockReject).toHaveBeenCalledWith("Maria");
  });
});
