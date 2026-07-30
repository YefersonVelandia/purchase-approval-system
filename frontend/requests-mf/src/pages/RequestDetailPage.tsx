import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { requestsService } from "../services/requests.service";
import type { PurchaseRequest, Approval } from "../types/request.types";

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

const approvalStatusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};

const roleLabels: Record<string, string> = {
  MANAGER: "Gerente",
  FINANCE: "Finanzas",
  LEGAL: "Legal",
};

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

const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<PurchaseRequest | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      requestsService.getById(id),
      requestsService.getApprovals(id),
    ])
      .then(([req, apprs]) => {
        setRequest(req);
        setApprovals(apprs);
      })
      .catch(() => setError("Error al cargar el detalle de la solicitud"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-status">Cargando detalle...</div>;
  if (error) return <div className="page-status page-error">{error}</div>;
  if (!request) return <div className="page-status page-error">Solicitud no encontrada</div>;

  return (
    <div className="request-detail-page">
      <Link to="/requests" className="back-link">&larr; Volver a solicitudes</Link>

      <div className="detail-card">
        <div className="detail-header">
          <h2>{request.title}</h2>
          <span
            className="status-badge"
            style={{ backgroundColor: statusColors[request.status] || "#6b7280" }}
          >
            {statusLabels[request.status] || request.status}
          </span>
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
            <span className="detail-label">Creada</span>
            <p className="detail-value">{formatDate(request.createdAt)}</p>
          </div>
        </div>

        <div className="detail-approvers">
          <h3>Aprobadores</h3>
          <div className="approvers-table">
            <div className="approvers-table-header">
              <span>Rol</span>
              <span>Nombre</span>
              <span>Email</span>
              <span>Estado</span>
              <span>Firmado por</span>
              <span>Fecha firma</span>
            </div>
            {request.approvers.map((approver) => {
              const approval = approvals.find(
                (a) => a.approverId === approver.email,
              );
              return (
                <div key={approver.email} className="approvers-table-row">
                  <span>{roleLabels[approver.role] || approver.role}</span>
                  <span>{approver.name}</span>
                  <span>{approver.email}</span>
                  <span>
                    {approval ? (
                      <span
                        className="status-dot"
                        style={{
                          backgroundColor:
                            approval.status === "APPROVED"
                              ? "#10b981"
                              : approval.status === "REJECTED"
                                ? "#ef4444"
                                : "#f59e0b",
                        }}
                      >
                        {approvalStatusLabels[approval.status] || approval.status}
                      </span>
                    ) : (
                      <span className="status-dot" style={{ backgroundColor: "#9ca3af" }}>
                        Sin aprobación
                      </span>
                    )}
                  </span>
                  <span>{approval?.signedBy || "-"}</span>
                  <span>{approval?.signedAt ? formatDate(approval.signedAt) : "-"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;
