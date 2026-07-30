import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OtpForm from "../components/OtpForm";

describe("OtpForm", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it("renders OTP input and submit button", () => {
    render(<OtpForm onSubmit={mockSubmit} />);
    expect(screen.getByLabelText("Código OTP")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Validar OTP" })).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<OtpForm onSubmit={mockSubmit} loading={true} />);
    expect(screen.getByRole("button", { name: "Validando..." })).toBeDisabled();
  });

  it("shows error message", () => {
    render(<OtpForm onSubmit={mockSubmit} error="Código inválido" />);
    expect(screen.getByText("Código inválido")).toBeInTheDocument();
  });

  it("shows expiration time", () => {
    render(<OtpForm onSubmit={mockSubmit} expiresAt="2026-07-30T08:00:00Z" />);
    expect(screen.getByText(/Expira:/)).toBeInTheDocument();
  });

  it("calls onSubmit with OTP code", () => {
    render(<OtpForm onSubmit={mockSubmit} />);
    const input = screen.getByLabelText("Código OTP");
    fireEvent.change(input, { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Validar OTP" }));
    expect(mockSubmit).toHaveBeenCalledWith("123456");
  });

  it("only accepts numeric input up to 6 digits", () => {
    render(<OtpForm onSubmit={mockSubmit} />);
    const input = screen.getByLabelText("Código OTP") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc123" } });
    expect(input.value).toBe("123");
    fireEvent.change(input, { target: { value: "1234567" } });
    expect(input.value).toBe("123456");
  });

  it("disables submit when OTP is not 6 digits", () => {
    render(<OtpForm onSubmit={mockSubmit} />);
    const input = screen.getByLabelText("Código OTP");
    fireEvent.change(input, { target: { value: "123" } });
    expect(screen.getByRole("button", { name: "Validar OTP" })).toBeDisabled();
  });
});
