import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestForm from "../components/RequestForm";
import { requestsService } from "../services/requests.service";

const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (form: {
    title: string;
    description: string;
    amount: string;
    approvers: Array<{ name: string; email: string; role: string }>;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await requestsService.create({
        title: form.title,
        description: form.description,
        amount: Number(form.amount),
        requesterId: "user-001",
        approvers: form.approvers.map((a) => ({
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

  return (
    <div className="create-request-page">
      <h2>Nueva Solicitud de Compra</h2>
      <RequestForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
};

export default CreateRequestPage;
