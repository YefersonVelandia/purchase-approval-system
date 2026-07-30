import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { IconCheckCircle, IconXCircle } from "../components/ui/Icons";

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
      if (type === "approve") await onApprove(signedBy.trim());
      else await onReject(signedBy.trim());
    } catch {
      setError("Error al procesar la acción. Intenta nuevamente.");
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <Card>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Acción de aprobación</h3>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200 mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="signedBy" className="block text-sm font-medium text-gray-700">
            Firmado por
          </label>
          <input
            id="signedBy"
            type="text"
            value={signedBy}
            onChange={(e) => setSignedBy(e.target.value)}
            placeholder="Nombre del aprobador"
            disabled={loading}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50"
            required
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="success"
            size="lg"
            onClick={() => handleAction("approve")}
            disabled={loading || !signedBy.trim()}
            loading={loading && action === "approve"}
            className="flex-1"
          >
            <IconCheckCircle size={18} />
            Aprobar
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={() => handleAction("reject")}
            disabled={loading || !signedBy.trim()}
            loading={loading && action === "reject"}
            className="flex-1"
          >
            <IconXCircle size={18} />
            Rechazar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ApprovalActions;
