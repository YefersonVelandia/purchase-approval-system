import React from "react";

const RequestsApp = React.lazy(() => import("requests-mf/RequestsApp"));

const RequestsModule: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading requests...</div>}>
      <RequestsApp />
    </React.Suspense>
  );
};

export default RequestsModule;
