import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RequestCard from "../components/RequestCard";
import type { PurchaseRequest } from "../types/request.types";

const mockRequest: PurchaseRequest = {
  id: "1",
  title: "Test Request",
  description: "A test purchase request",
  amount: 1500,
  requesterId: "user-1",
  status: "PENDING",
  createdAt: "2026-07-30T10:00:00Z",
  approvers: [],
};

const renderCard = (request: PurchaseRequest = mockRequest) =>
  render(
    <MemoryRouter>
      <RequestCard request={request} />
    </MemoryRouter>,
  );

describe("RequestCard", () => {
  it("renders request title", () => {
    renderCard();
    expect(screen.getByText("Test Request")).toBeInTheDocument();
  });

  it("renders request description", () => {
    renderCard();
    expect(screen.getByText("A test purchase request")).toBeInTheDocument();
  });

  it("renders formatted amount", () => {
    renderCard();
    expect(screen.getByText(/1\.?500/)).toBeInTheDocument();
  });

  it("renders status label", () => {
    renderCard();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("links to request detail", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/requests/1");
  });

  it("renders different status labels correctly", () => {
    const statuses: Array<{ status: PurchaseRequest["status"]; label: string }> = [
      { status: "PENDING", label: "Pendiente" },
      { status: "SIGNED", label: "Firmado" },
      { status: "REJECTED", label: "Rechazado" },
      { status: "COMPLETED", label: "Completado" },
    ];
    for (const { status, label } of statuses) {
      const { unmount } = renderCard({ ...mockRequest, status });
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });
});
