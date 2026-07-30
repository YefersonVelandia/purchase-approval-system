import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ApprovalEntryPage from "../pages/ApprovalEntryPage";
import OtpValidationPage from "../pages/OtpValidationPage";
import ApprovalDetailPage from "../pages/ApprovalDetailPage";
import ApprovalResultPage from "../pages/ApprovalResultPage";

const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/approve" element={<ApprovalEntryPage />} />
    <Route path="/approve/otp" element={<OtpValidationPage />} />
    <Route path="/approve/detail" element={<ApprovalDetailPage />} />
    <Route path="/approve/result" element={<ApprovalResultPage />} />
    <Route path="*" element={<Navigate to="approve" replace />} />
  </Routes>
);

export default AppRouter;
