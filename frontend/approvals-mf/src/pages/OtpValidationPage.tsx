import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OtpForm from "../components/OtpForm";
import { useApprovalFlow } from "../app/ApprovalContext";
import { approvalService } from "../services/approval.service";

const OtpValidationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expiresAt = searchParams.get("expiresAt");
  const otpCode = searchParams.get("otpCode");
  const solicitudIdFromUrl = searchParams.get("solicitud_id");
  const { state, setApprovalId, setApproverId, setSolicitudId } = useApprovalFlow();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (otpValue: string) => {
    if (!state.approverToken) {
      setError("Token de aprobación no encontrado. Vuelve a iniciar el proceso.");
      return;
    }

    try {
      const res = await approvalService.validateOtp(state.approverToken, otpValue);
      setApprovalId(res.approvalId);
      setApproverId(res.approverId);
      const id = state.solicitudId || solicitudIdFromUrl || "";
      if (id) setSolicitudId(id);
      navigate(`/approvals/approve/detail?solicitud_id=${encodeURIComponent(id)}`, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 400) {
          setError("Código OTP inválido o expirado.");
        } else {
          setError("Error al validar el OTP. Intenta nuevamente.");
        }
      } else {
        setError("Error al validar el OTP. Intenta nuevamente.");
      }
    }
  };

  return (
    <OtpForm
      onSubmit={handleSubmit}
      error={error}
      expiresAt={expiresAt}
      mockCode={otpCode}
    />
  );
};

export default OtpValidationPage;
