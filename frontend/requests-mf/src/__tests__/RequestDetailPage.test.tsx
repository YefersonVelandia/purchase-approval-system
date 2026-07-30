import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RequestDetailPage from "../pages/RequestDetailPage";
import { requestsService } from "../services/requests.service";

jest.mock("../services/requests.service");

const mockedService = requestsService as jest.Mocked<typeof requestsService>;

const renderPage = (id: string = "1") =>
  render(
    <MemoryRouter initialEntries={[`/requests/${id}`]}>
      <Routes>
        <Route path="/requests/:id" element={<RequestDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe("RequestDetailPage", () => {
  beforeEach(() => {
    mockedService.getById.mockClear();
    mockedService.getApprovals.mockClear();
  });

  it("shows loading state initially", () => {
    mockedService.getById.mockReturnValue(new Promise(() => {}));
    mockedService.getApprovals.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText("Cargando detalle...")).toBeInTheDocument();
  });

  it("shows error state when fetch fails", async () => {
    mockedService.getById.mockRejectedValue(new Error("Not found"));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Error al cargar el detalle de la solicitud")).toBeInTheDocument();
    });
  });

  it("renders request detail information", async () => {
    mockedService.getById.mockResolvedValue({
      id: "1",
      title: "Detail Request",
      description: "Detail description",
      amount: 2500,
      requesterId: "u1",
      status: "PENDING",
      createdAt: "2026-07-30T10:00:00Z",
      approvers: [
        { name: "Juan", email: "juan@test.com", role: "MANAGER" },
        { name: "Maria", email: "maria@test.com", role: "FINANCE" },
        { name: "Carlos", email: "carlos@test.com", role: "LEGAL" },
      ],
    });
    mockedService.getApprovals.mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Detail Request")).toBeInTheDocument();
      expect(screen.getByText("Detail description")).toBeInTheDocument();
      expect(screen.getByText("Juan")).toBeInTheDocument();
      expect(screen.getByText("maria@test.com")).toBeInTheDocument();
    });
  });
});
