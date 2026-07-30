import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input, { Textarea } from "../components/ui/Input";
import { IconChevronLeft } from "../components/ui/Icons";
import { requestsService } from "../services/requests.service";

interface ApproverField {
  name: string;
  email: string;
  role: string;
}

const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [approvers, setApprovers] = useState<ApproverField[]>([
    { name: "", email: "", role: "MANAGER" },
    { name: "", email: "", role: "FINANCE" },
    { name: "", email: "", role: "LEGAL" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleLabels: Record<string, string> = {
    MANAGER: "Gerente",
    FINANCE: "Finanzas",
    LEGAL: "Legal",
  };

  const handleApproverChange = (index: number, field: "name" | "email", value: string) => {
    setApprovers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !amount) return;

    setLoading(true);
    setError(null);
    try {
      await requestsService.create({
        title: title.trim(),
        description: description.trim(),
        amount: Number(amount),
        requesterId: "user-001",
        approvers: approvers.map((a) => ({
          name: a.name,
          email: a.email,
          role: a.role as "MANAGER" | "FINANCE" | "LEGAL",
        })),
      });
      navigate("/requests");
    } catch {
      setError("Error al crear la solicitud. Verifica los datos e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const isValid = title.trim() && description.trim() && amount && approvers.every((a) => a.name && a.email);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/requests")} className="p-2">
          <IconChevronLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Nueva Solicitud de Compra</h1>
          <p className="text-sm text-gray-500 mt-1">Completa los campos para crear una solicitud</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Título"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Compra de equipos de cómputo"
            required
          />

          <Textarea
            label="Descripción"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe el motivo y detalle de la compra"
            required
          />

          <Input
            label="Monto (USD)"
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />

          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Aprobadores</h3>
            <div className="space-y-4">
              {approvers.map((approver, index) => (
                <div key={approver.role} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-primary-700 mb-3">{roleLabels[approver.role] || approver.role}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Nombre"
                      type="text"
                      value={approver.name}
                      onChange={(e) => handleApproverChange(index, "name", e.target.value)}
                      placeholder="Nombre del aprobador"
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={approver.email}
                      onChange={(e) => handleApproverChange(index, "email", e.target.value)}
                      placeholder="correo@empresa.com"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate("/requests")}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading} disabled={!isValid}>
              {loading ? "Creando..." : "Crear Solicitud"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateRequestPage;
