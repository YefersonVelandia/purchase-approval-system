import React from "react";
import { Routes, Route } from "react-router-dom";
import RequestsListPage from "../pages/RequestsListPage";
import CreateRequestPage from "../pages/CreateRequestPage";
import RequestDetailPage from "../pages/RequestDetailPage";

const AppRouter: React.FC = () => (
  <Routes>
    <Route index element={<RequestsListPage />} />
    <Route path="create" element={<CreateRequestPage />} />
    <Route path=":id" element={<RequestDetailPage />} />
  </Routes>
);

export default AppRouter;
