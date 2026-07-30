import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import RequestsModule from "../modules/RequestsModule";
import ApprovalsModule from "../modules/ApprovalsModule";
import MockMailModule from "../modules/MockMailModule";

const Home: React.FC = () => {
  return <h2>Welcome to Purchase Approval System</h2>;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/requests/*" element={<RequestsModule />} />
        <Route path="/approvals/inbox" element={<MockMailModule />} />
        <Route path="/approvals/*" element={<ApprovalsModule />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
