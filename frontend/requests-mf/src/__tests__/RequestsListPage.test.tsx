import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RequestsListPage from "../pages/RequestsListPage";
import { requestsService } from "../services/requests.service";

jest.mock("../services/requests.service");

const mockedService = requestsService as jest.Mocked<typeof requestsService>;

const renderPage = () =>
  render(
    <MemoryRouter>
      <RequestsListPage />
    </MemoryRouter>,
  );

describe("RequestsListPage", () => {
  beforeEach(() => {
    mockedService.list.mockClear();
  });

  it("shows loading state initially", () => {
    mockedService.list.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText("Cargando solicitudes...")).toBeInTheDocument();
  });

  it("shows error state when fetch fails", async () => {
    mockedService.list.mockRejectedValue(new Error("Network error"));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Error al cargar las solicitudes")).toBeInTheDocument();
    });
  });

  it("shows empty state when no requests", async () => {
    mockedService.list.mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("No hay solicitudes registradas.")).toBeInTheDocument();
    });
  });

  it("renders list of requests", async () => {
    mockedService.list.mockResolvedValue([
      {
        id: "1",
        title: "Request 1",
        description: "Desc 1",
        amount: 100,
        requesterId: "u1",
        status: "PENDING",
        createdAt: "2026-07-30T10:00:00Z",
        approvers: [],
      },
      {
        id: "2",
        title: "Request 2",
        description: "Desc 2",
        amount: 200,
        requesterId: "u2",
        status: "COMPLETED",
        createdAt: "2026-07-29T10:00:00Z",
        approvers: [],
      },
    ]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Request 1")).toBeInTheDocument();
      expect(screen.getByText("Request 2")).toBeInTheDocument();
    });
  });
});
