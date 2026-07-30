import React, { useState } from "react";

interface ApprovalActionsProps {
  onApprove: (signedBy: string) => Promise<void>;
  onReject: (signedBy: string) => Promise<void>;
  approverName?: string;
}

const ApprovalActions: React.FC<ApprovalActionsProps> = ({
  onApprove,
  onReject,
  approverName: initialName,
}) => {
  const [signedBy, setSignedBy] = useState(initialName || "");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (type: "approve" | "reject") => {
    if (!signedBy.trim()) return;
    setAction(type);
    setLoading(true);
    setError(null);
    try {
      if (type === "approve") {
        await onApprove(signedBy.trim());
      } else {
        await onReject(signedBy.trim());
      }
    } catch {
      setError("Error al procesar la acción. Intenta nuevamente.");
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <div className="approval-actions">
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="signedBy">Firmado por</label>
        <input
          id="signedBy"
          type="text"
          value={signedBy}
          onChange={(e) => setSignedBy(e.target.value)}
          placeholder="Nombre del aprobador"
          disabled={loading}
          required
        />
      </div>

      <div className="actions-buttons">
        <button
          className="btn-approve"
          onClick={() => handleAction("approve")}
          disabled={loading || !signedBy.trim()}
        >
          {loading && action === "approve" ? "Aprobando..." : "Aprobar"}
        </button>
        <button
          className="btn-reject"
          onClick={() => handleAction("reject")}
          disabled={loading || !signedBy.trim()}
        >
          {loading && action === "reject" ? "Rechazando..." : "Rechazar"}
        </button>
      </div>
    </div>
  );
};

export default ApprovalActions;
