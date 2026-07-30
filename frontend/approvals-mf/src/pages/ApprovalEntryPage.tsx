import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApprovalFlow } from "../app/ApprovalContext";
import { approvalService } from "../services/approval.service";

const ApprovalEntryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSolicitudId, setApproverToken, setApprovalId, setApproverId } = useApprovalFlow();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const solicitudId = searchParams.get("solicitud_id");
    const approverToken = searchParams.get("approver_token");

    if (!solicitudId || !approverToken) {
      setError("Enlace inválido. Faltan parámetros de aprobación.");
      return;
    }

    setSolicitudId(solicitudId);
    setApproverToken(approverToken);

    approvalService
      .generateOtp(approverToken)
      .then((res) => {
        setApprovalId(res.approvalId);
        setApproverId(res.approvalId);
        navigate(`otp?expiresAt=${encodeURIComponent(res.otpExpiresAt)}&otpCode=${encodeURIComponent(res.otpCode)}`, {
          replace: true,
        });
      })
      .catch(() => {
        setError("Error al generar el código OTP. El enlace puede haber expirado.");
      });
  }, [searchParams, navigate, setSolicitudId, setApproverToken, setApprovalId, setApproverId]);

  if (error) {
    return (
      <div className="page-status page-error">
        <p>{error}</p>
      </div>
    );
  }

  return <div className="page-status">Generando código OTP...</div>;
};

export default ApprovalEntryPage;
