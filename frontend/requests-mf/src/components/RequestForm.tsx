import React, { useState } from "react";
import type { ApproverRole } from "../types/request.types";

interface FormData {
  title: string;
  description: string;
  amount: string;
  approvers: Array<{ name: string; email: string; role: ApproverRole }>;
}

interface RequestFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const roles: ApproverRole[] = ["MANAGER", "FINANCE", "LEGAL"];

const roleLabels: Record<ApproverRole, string> = {
  MANAGER: "Gerente",
  FINANCE: "Finanzas",
  LEGAL: "Legal",
};

const initialForm: FormData = {
  title: "",
  description: "",
  amount: "",
  approvers: roles.map((role) => ({ name: "", email: "", role })),
};

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, loading, error }) => {
  const [form, setForm] = useState<FormData>(initialForm);

  const handleChange = (field: keyof Omit<FormData, "approvers">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApproverChange = (index: number, field: "name" | "email", value: string) => {
    setForm((prev) => {
      const approvers = [...prev.approvers];
      approvers[index] = { ...approvers[index], [field]: value };
      return { ...prev, approvers };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Monto (USD)</label>
        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          required
        />
      </div>

      <fieldset className="form-approvers">
        <legend>Aprobadores</legend>
        {form.approvers.map((approver, index) => (
          <div key={approver.role} className="approver-group">
            <p className="approver-role-label">{roleLabels[approver.role]}</p>
            <div className="approver-fields">
              <input
                type="text"
                placeholder="Nombre"
                value={approver.name}
                onChange={(e) => handleApproverChange(index, "name", e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={approver.email}
                onChange={(e) => handleApproverChange(index, "email", e.target.value)}
                required
              />
            </div>
          </div>
        ))}
      </fieldset>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? "Creando..." : "Crear Solicitud"}
      </button>
    </form>
  );
};

export default RequestForm;
