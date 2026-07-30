import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "../pages/Dashboard";
import RequestsModule from "../modules/RequestsModule";
import ApprovalsModule from "../modules/ApprovalsModule";
import MockMailModule from "../modules/MockMailModule";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/requests/*" element={<RequestsModule />} />
        <Route path="/approvals/inbox" element={<MockMailModule />} />
        <Route path="/approvals/*" element={<ApprovalsModule />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
