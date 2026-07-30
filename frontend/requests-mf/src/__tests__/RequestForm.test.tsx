import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RequestForm from "../components/RequestForm";

describe("RequestForm", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it("renders all form fields", () => {
    render(<RequestForm onSubmit={mockSubmit} />);
    expect(screen.getByLabelText("Título")).toBeInTheDocument();
    expect(screen.getByLabelText("Descripción")).toBeInTheDocument();
    expect(screen.getByLabelText("Monto (USD)")).toBeInTheDocument();
    expect(screen.getByText("Aprobadores")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Crear Solicitud" })).toBeInTheDocument();
  });

  it("renders approver fields for each role", () => {
    render(<RequestForm onSubmit={mockSubmit} />);
    expect(screen.getByText("Gerente")).toBeInTheDocument();
    expect(screen.getByText("Finanzas")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  it("disables submit button when loading", () => {
    render(<RequestForm onSubmit={mockSubmit} loading={true} />);
    expect(screen.getByRole("button", { name: "Creando..." })).toBeDisabled();
  });

  it("shows error message when error prop is set", () => {
    render(<RequestForm onSubmit={mockSubmit} error="Error de prueba" />);
    expect(screen.getByText("Error de prueba")).toBeInTheDocument();
  });

  it("calls onSubmit with form data", () => {
    render(<RequestForm onSubmit={mockSubmit} />);
    fireEvent.change(screen.getByLabelText("Título"), { target: { value: "Laptop" } });
    fireEvent.change(screen.getByLabelText("Descripción"), {
      target: { value: "Need a laptop" },
    });
    fireEvent.change(screen.getByLabelText("Monto (USD)"), { target: { value: "1500" } });
    const nameInputs = screen.getAllByPlaceholderText("Nombre");
    const emailInputs = screen.getAllByPlaceholderText("Email");
    nameInputs.forEach((input) => fireEvent.change(input, { target: { value: "Test" } }));
    emailInputs.forEach((input) => fireEvent.change(input, { target: { value: "test@test.com" } }));
    fireEvent.click(screen.getByRole("button", { name: "Crear Solicitud" }));
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Laptop",
        description: "Need a laptop",
        amount: "1500",
      }),
    );
  });
});
