import React from "react";

const RequestsApp = React.lazy(() => import("requests-mf/RequestsApp"));

const RequestsModule: React.FC = () => (
  <React.Suspense fallback={<div className="page-status">Cargando módulo de solicitudes...</div>}>
    <RequestsApp />
  </React.Suspense>
);

export default RequestsModule;
