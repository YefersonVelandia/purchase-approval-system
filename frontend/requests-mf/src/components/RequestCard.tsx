import React from "react";
import { Link } from "react-router-dom";
import type { PurchaseRequest } from "../types/request.types";

interface RequestCardProps {
  request: PurchaseRequest;
}

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  SIGNED: "Firmado",
  REJECTED: "Rechazado",
  COMPLETED: "Completado",
};

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  SIGNED: "#3b82f6",
  REJECTED: "#ef4444",
  COMPLETED: "#10b981",
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(amount);

const RequestCard: React.FC<RequestCardProps> = ({ request }) => (
  <Link to={`/requests/${request.id}`} className="request-card">
    <div className="request-card-header">
      <h3 className="request-card-title">{request.title}</h3>
      <span
        className="request-card-status"
        style={{ backgroundColor: statusColors[request.status] || "#6b7280" }}
      >
        {statusLabels[request.status] || request.status}
      </span>
    </div>
    <p className="request-card-desc">{request.description}</p>
    <div className="request-card-footer">
      <span className="request-card-amount">{formatCurrency(request.amount)}</span>
      <span className="request-card-date">{formatDate(request.createdAt)}</span>
    </div>
  </Link>
);

export default RequestCard;
