import React from "react";
import { useApprovalFlow } from "../app/ApprovalContext";
import Card from "../components/ui/Card";
import { IconCheckCircle, IconXCircle, IconInfo } from "../components/ui/Icons";

const ApprovalResultPage: React.FC = () => {
  const { state } = useApprovalFlow();

  if (!state.result) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
              <IconInfo size={28} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Sin información</h2>
            <p className="text-sm text-gray-500">No se encontró información del resultado.</p>
          </div>
        </Card>
      </div>
    );
  }

  const { status, signedBy } = state.result;
  const isApproved = status === "APPROVED";

  return (
    <div className="max-w-lg mx-auto mt-12">
      <Card>
        <div className="text-center space-y-4">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              isApproved ? "bg-emerald-50" : "bg-red-50"
            }`}
          >
            {isApproved ? (
              <IconCheckCircle size={36} className="text-emerald-600" />
            ) : (
              <IconXCircle size={36} className="text-red-600" />
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isApproved ? "Solicitud Aprobada" : "Solicitud Rechazada"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isApproved
                ? "La solicitud de compra ha sido aprobada exitosamente."
                : "La solicitud de compra ha sido rechazada."}
            </p>
          </div>

          <div
            className={`rounded-lg px-4 py-3 border ${
              isApproved
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-0.5">Firmado por</p>
            <p className="text-base font-semibold">{signedBy}</p>
          </div>

          <p className="text-xs text-gray-400">
            Puedes cerrar esta ventana. El sistema registrará tu decisión.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ApprovalResultPage;
