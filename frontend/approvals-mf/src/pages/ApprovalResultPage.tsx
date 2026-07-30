import React from "react";
import { useApprovalFlow } from "../app/ApprovalContext";

const ApprovalResultPage: React.FC = () => {
  const { state } = useApprovalFlow();

  if (!state.result) {
    return <div className="page-status page-error">No se encontró información del resultado.</div>;
  }

  const { status, signedBy } = state.result;
  const isApproved = status === "APPROVED";

  return (
    <div className={`approval-result ${isApproved ? "result-approved" : "result-rejected"}`}>
      <div className="result-icon">{isApproved ? "✓" : "✗"}</div>
      <h2>{isApproved ? "Solicitud Aprobada" : "Solicitud Rechazada"}</h2>
      <p>
        {isApproved
          ? "La solicitud de compra ha sido aprobada exitosamente."
          : "La solicitud de compra ha sido rechazada."}
      </p>
      <p className="result-signed">
        Firmado por: <strong>{signedBy}</strong>
      </p>
      <p className="result-info">
        Puedes cerrar esta ventana. El sistema registrará tu decisión.
      </p>
    </div>
  );
};

export default ApprovalResultPage;
