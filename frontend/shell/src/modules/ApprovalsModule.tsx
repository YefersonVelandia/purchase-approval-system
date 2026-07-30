import React from "react";

const ApprovalsApp = React.lazy(() => import("approvals-mf/ApprovalsApp"));

const ApprovalsModule: React.FC = () => (
  <React.Suspense fallback={<div className="page-status">Cargando módulo de aprobaciones...</div>}>
    <ApprovalsApp />
  </React.Suspense>
);

export default ApprovalsModule;
