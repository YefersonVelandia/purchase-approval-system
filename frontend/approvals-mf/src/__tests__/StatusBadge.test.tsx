import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../components/StatusBadge";

describe("StatusBadge", () => {
  const cases: Array<{ status: string; expected: string }> = [
    { status: "PENDING", expected: "Pendiente" },
    { status: "APPROVED", expected: "Aprobado" },
    { status: "REJECTED", expected: "Rechazado" },
    { status: "SIGNED", expected: "Firmado" },
    { status: "COMPLETED", expected: "Completado" },
  ];

  for (const { status, expected } of cases) {
    it(`renders ${status} as ${expected}`, () => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  }

  it("uses custom labels when provided", () => {
    render(<StatusBadge status="CUSTOM" customLabels={{ CUSTOM: "Custom Label" }} />);
    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });
});
