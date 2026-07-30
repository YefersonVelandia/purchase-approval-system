import React from "react";

const ApprovalsApp = React.lazy(() => import("approvals-mf/ApprovalsApp"));

const ApprovalsModule: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading approvals...</div>}>
      <ApprovalsApp />
    </React.Suspense>
  );
};

export default ApprovalsModule;
