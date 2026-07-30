import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApprovalFlow } from "../app/ApprovalContext";
import { approvalService } from "../services/approval.service";
import { LoadingScreen } from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import Card from "../components/ui/Card";
import { IconShield, IconAlertTriangle } from "../components/ui/Icons";

const ApprovalEntryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSolicitudId, setApproverToken, setApprovalId, setApproverId } = useApprovalFlow();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "invalid">("loading");

  useEffect(() => {
    const solicitudId = searchParams.get("solicitud_id");
    const approverToken = searchParams.get("approver_token");

    if (!solicitudId || !approverToken) {
      setStatus("invalid");
      setError("Enlace inválido. Faltan parámetros de aprobación.");
      return;
    }

    setSolicitudId(solicitudId);
    setApproverToken(approverToken);

    approvalService
      .generateOtp(approverToken)
      .then((res) => {
        setApprovalId(res.approvalId);
        navigate(
          `/approvals/approve/otp?solicitud_id=${encodeURIComponent(solicitudId)}&expiresAt=${encodeURIComponent(res.otpExpiresAt)}&otpCode=${encodeURIComponent(res.otpCode)}`,
          { replace: true },
        );
      })
      .catch(() => {
        setStatus("error");
        setError("Error al generar el código OTP. El enlace puede haber expirado.");
      });
  }, [searchParams, navigate, setSolicitudId, setApproverToken, setApprovalId, setApproverId]);

  if (status === "invalid") {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
              <IconAlertTriangle size={28} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Enlace inválido</h2>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return <ErrorState message={error || "Error desconocido"} />;
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center">
            <IconShield size={28} className="text-primary-600" />
          </div>
          <LoadingScreen message="Generando código OTP..." />
        </div>
      </Card>
    </div>
  );
};

export default ApprovalEntryPage;
