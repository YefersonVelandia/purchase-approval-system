import React, { createContext, useContext, useState, useCallback } from "react";
import type { PurchaseRequest, Approval } from "../types/approval.types";

interface ApprovalFlowState {
  solicitudId: string | null;
  approverToken: string | null;
  approvalId: string | null;
  approverId: string | null;
  purchaseRequest: PurchaseRequest | null;
  approval: Approval | null;
  result: { status: "APPROVED" | "REJECTED"; signedBy: string } | null;
}

interface ApprovalContextValue {
  state: ApprovalFlowState;
  setSolicitudId: (id: string) => void;
  setApproverToken: (token: string) => void;
  setApprovalId: (id: string) => void;
  setApproverId: (id: string) => void;
  setPurchaseRequest: (req: PurchaseRequest) => void;
  setApproval: (appr: Approval) => void;
  setResult: (result: { status: "APPROVED" | "REJECTED"; signedBy: string }) => void;
  reset: () => void;
}

const initialState: ApprovalFlowState = {
  solicitudId: null,
  approverToken: null,
  approvalId: null,
  approverId: null,
  purchaseRequest: null,
  approval: null,
  result: null,
};

const ApprovalContext = createContext<ApprovalContextValue | null>(null);

export const ApprovalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ApprovalFlowState>(initialState);

  const setSolicitudId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, solicitudId: id }));
  }, []);

  const setApproverToken = useCallback((token: string) => {
    setState((prev) => ({ ...prev, approverToken: token }));
  }, []);

  const setApprovalId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, approvalId: id }));
  }, []);

  const setApproverId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, approverId: id }));
  }, []);

  const setPurchaseRequest = useCallback((req: PurchaseRequest) => {
    setState((prev) => ({ ...prev, purchaseRequest: req }));
  }, []);

  const setApproval = useCallback((appr: Approval) => {
    setState((prev) => ({ ...prev, approval: appr }));
  }, []);

  const setResult = useCallback(
    (result: { status: "APPROVED" | "REJECTED"; signedBy: string }) => {
      setState((prev) => ({ ...prev, result }));
    },
    [],
  );

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <ApprovalContext.Provider
      value={{
        state,
        setSolicitudId,
        setApproverToken,
        setApprovalId,
        setApproverId,
        setPurchaseRequest,
        setApproval,
        setResult,
        reset,
      }}
    >
      {children}
    </ApprovalContext.Provider>
  );
};

export const useApprovalFlow = (): ApprovalContextValue => {
  const ctx = useContext(ApprovalContext);
  if (!ctx) throw new Error("useApprovalFlow must be used within ApprovalProvider");
  return ctx;
};
