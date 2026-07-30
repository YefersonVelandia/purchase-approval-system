import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApprovalDetail from "../components/ApprovalDetail";
import ApprovalActions from "../components/ApprovalActions";
import { useApprovalFlow } from "../app/ApprovalContext";
import { approvalService } from "../services/approval.service";
import { LoadingScreen } from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";

const ApprovalDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, setSolicitudId, setPurchaseRequest, setResult } = useApprovalFlow();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const solicitudId = searchParams.get("solicitud_id") || state.solicitudId;

  useEffect(() => {
    if (!solicitudId) {
      setError("Solicitud no encontrada. Vuelve a iniciar desde la bandeja de aprobaciones.");
      setLoading(false);
      return;
    }
    if (!state.solicitudId) {
      setSolicitudId(solicitudId);
    }
    approvalService
      .getPurchaseRequest(solicitudId)
      .then((req) => {
        setPurchaseRequest(req);
      })
      .catch(() => {
        setError("Error al cargar el detalle de la solicitud.");
      })
      .finally(() => setLoading(false));
  }, [solicitudId, state.solicitudId, navigate, setSolicitudId, setPurchaseRequest]);

  const handleApprove = async (signedBy: string) => {
    if (!state.approvalId) return;
    await approvalService.updateApprovalStatus(state.approvalId, "APPROVED", signedBy);
    setResult({ status: "APPROVED", signedBy });
    navigate("/approvals/approve/result", { replace: true });
  };

  const handleReject = async (signedBy: string) => {
    if (!state.approvalId) return;
    await approvalService.updateApprovalStatus(state.approvalId, "REJECTED", signedBy);
    setResult({ status: "REJECTED", signedBy });
    navigate("/approvals/approve/result", { replace: true });
  };

  if (loading) return <LoadingScreen message="Cargando detalle de la solicitud..." />;
  if (error) return <ErrorState message={error} />;
  if (!state.purchaseRequest) return <ErrorState message="Solicitud no encontrada" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Detalle de Solicitud</h1>
        <p className="text-sm text-gray-500 mt-1">Revisa la información antes de aprobar o rechazar</p>
      </div>
      <ApprovalDetail request={state.purchaseRequest} />
      <ApprovalActions
        onApprove={handleApprove}
        onReject={handleReject}
        approverName={state.approverId || state.approval?.approverId || ""}
      />
    </div>
  );
};

export default ApprovalDetailPage;
