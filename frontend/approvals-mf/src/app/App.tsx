import React from "react";
import { ApprovalProvider } from "./ApprovalContext";
import AppRouter from "./router";
import "../styles/approvals.css";

const ApprovalsApp: React.FC = () => (
  <ApprovalProvider>
    <AppRouter />
  </ApprovalProvider>
);

export default ApprovalsApp;
