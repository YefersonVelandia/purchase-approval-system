import React from "react";
import type { PurchaseRequest } from "../types/approval.types";
import StatusBadge from "./StatusBadge";

interface ApprovalDetailProps {
  request: PurchaseRequest;
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(amount);

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ApprovalDetail: React.FC<ApprovalDetailProps> = ({ request }) => (
  <div className="approval-detail">
    <div className="detail-header">
      <h2>{request.title}</h2>
      <StatusBadge status={request.status} />
    </div>

    <div className="detail-body">
      <div className="detail-row">
        <span className="detail-label">Descripción</span>
        <p className="detail-value">{request.description}</p>
      </div>
      <div className="detail-row">
        <span className="detail-label">Monto</span>
        <p className="detail-value">{formatCurrency(request.amount)}</p>
      </div>
      <div className="detail-row">
        <span className="detail-label">Solicitante</span>
        <p className="detail-value">{request.requesterId}</p>
      </div>
      <div className="detail-row">
        <span className="detail-label">Creada</span>
        <p className="detail-value">{formatDate(request.createdAt)}</p>
      </div>
      <div className="detail-row">
        <span className="detail-label">Estado actual</span>
        <p className="detail-value">
          <StatusBadge status={request.status} />
        </p>
      </div>
    </div>
  </div>
);

export default ApprovalDetail;
