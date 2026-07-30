import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card, { CardHeader } from "../components/ui/Card";
import Badge, { getStatusVariant } from "../components/ui/Badge";
import { LoadingScreen } from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import Table from "../components/ui/Table";
import type { Column } from "../components/ui/Table";
import {
  IconChevronLeft,
  IconClock,
  IconUsers,
  IconDollar,
  IconInfo,
} from "../components/ui/Icons";
import { requestsService } from "../services/requests.service";
import type { PurchaseRequest, Approval } from "../types/request.types";
import Button from "../components/ui/Button";

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  SIGNED: "Firmado",
  REJECTED: "Rechazado",
  COMPLETED: "Completado",
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
  const navigate = useNavigate();
  const [request, setRequest] = useState<PurchaseRequest | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID de solicitud no especificado");
      return;
    }
    Promise.all([requestsService.getById(id), requestsService.getApprovals(id)])
      .then(([req, apprs]) => {
        setRequest(req);
        setApprovals(apprs);
      })
      .catch(() => setError("Error al cargar el detalle de la solicitud"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen message="Cargando detalle de solicitud..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!request) return <ErrorState message="Solicitud no encontrada" />;

  const getApprovalVariant = (status: string) => {
    if (status === "APPROVED") return "approved" as const;
    if (status === "REJECTED") return "rejected" as const;
    return "pending" as const;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button onClick={() => navigate("/requests")} variant="ghost">
        <IconChevronLeft size={16} />
        Volver a solicitudes
      </Button>

      {/* Main card */}
      <Card padding={false}>
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-gray-900">{request.title}</h1>
              <p className="text-sm text-gray-500">ID: {request.id}</p>
            </div>
            <Badge variant={getStatusVariant(request.status)}>
              {statusLabels[request.status] || request.status}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <IconInfo size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </p>
                <p className="text-sm text-gray-900 mt-0.5">{request.description}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconDollar size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</p>
                <p className="text-lg font-semibold text-gray-900 mt-0.5">
                  {formatCurrency(request.amount)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconUsers size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitante
                </p>
                <p className="text-sm text-gray-900 mt-0.5">{request.requesterId}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconClock size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Creada</p>
                <p className="text-sm text-gray-900 mt-0.5">{formatDate(request.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Approvers table */}
      <Card padding={false}>
        <CardHeader
          title="Aprobadores"
          action={
            <span className="text-xs text-gray-500">
              {approvals.filter((a) => a.status === "APPROVED").length}/{request.approvers.length}{" "}
              aprobados
            </span>
          }
        />
        <Table<{
          name: string; email: string; role: string;
        }>
          columns={[
            { key: "role", header: "Rol", render: (app) => <span className="font-medium text-gray-900">{roleLabels[app.role] || app.role}</span> },
            { key: "name", header: "Nombre" },
            { key: "email", header: "Email" },
            { key: "_status", header: "Estado", render: (app) => {
              const approval = approvals.find((a) => a.approverId === app.email);
              return approval ? (
                <Badge variant={getApprovalVariant(approval.status)}>
                  {approvalStatusLabels[approval.status] || approval.status}
                </Badge>
              ) : (
                <Badge variant="default">Sin aprobación</Badge>
              );
            }},
            { key: "_signedBy", header: "Firmado por", render: (app) => {
              const approval = approvals.find((a) => a.approverId === app.email);
              return <>{approval?.signedBy || "-"}</>;
            }},
            { key: "_signedAt", header: "Fecha", render: (app) => {
              const approval = approvals.find((a) => a.approverId === app.email);
              return <span className="text-gray-500">{approval?.signedAt ? formatDate(approval.signedAt) : "-"}</span>;
            }},
          ]}
          data={request.approvers}
          keyExtractor={(app) => app.email}
          emptyMessage="No hay aprobadores asignados."
        />
      </Card>

      {/* Approval progress */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Progreso de aprobación</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {request.approvers.map((approver, idx) => {
            const approval = approvals.find((a) => a.approverId === approver.email);
            const isApproved = approval?.status === "APPROVED";
            const isRejected = approval?.status === "REJECTED";
            return (
              <React.Fragment key={approver.email}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isApproved
                        ? "bg-emerald-100 text-emerald-700"
                        : isRejected
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-[10px] text-gray-500 text-center max-w-[60px] truncate">
                    {roleLabels[approver.role]}
                  </span>
                </div>
                {idx < request.approvers.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded ${isApproved ? "bg-emerald-400" : "bg-gray-200"}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      {request.status === "COMPLETED" && (
        <Card>
          <div className="text-center py-4">
            <Button
              onClick={() => window.open(requestsService.getEvidenceUrl(request.id), "_blank")}
              size="lg"
            >
              Descargar PDF de Evidencia
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RequestDetailPage;
