import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApprovalDetail from "../components/ApprovalDetail";
import ApprovalActions from "../components/ApprovalActions";
import { useApprovalFlow } from "../app/ApprovalContext";
import { approvalService } from "../services/approval.service";

const ApprovalDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, setSolicitudId, setPurchaseRequest, setResult } = useApprovalFlow();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const solicitudId = state.solicitudId || searchParams.get("solicitud_id");

  useEffect(() => {
    if (!solicitudId) {
      navigate("..", { replace: true });
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
    navigate("result", { replace: true });
  };

  const handleReject = async (signedBy: string) => {
    if (!state.approvalId) return;
    await approvalService.updateApprovalStatus(state.approvalId, "REJECTED", signedBy);
    setResult({ status: "REJECTED", signedBy });
    navigate("result", { replace: true });
  };

  if (loading) return <div className="page-status">Cargando detalle de la solicitud...</div>;
  if (error) return <div className="page-status page-error">{error}</div>;
  if (!state.purchaseRequest) return <div className="page-status page-error">Solicitud no encontrada</div>;

  return (
    <div className="approval-detail-page">
      <ApprovalDetail request={state.purchaseRequest} />
      <div className="approval-section">
        <h3>Acción de aprobación</h3>
        <ApprovalActions
          onApprove={handleApprove}
          onReject={handleReject}
          approverName={state.approval?.approverId || ""}
        />
      </div>
    </div>
  );
};

export default ApprovalDetailPage;
