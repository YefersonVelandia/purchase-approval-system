export type PurchaseRequestStatus = "PENDING" | "SIGNED" | "REJECTED" | "COMPLETED";
export type ApproverRole = "MANAGER" | "FINANCE" | "LEGAL";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Approver {
  name: string;
  email: string;
  role: ApproverRole;
}

export interface PurchaseRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  requesterId: string;
  approvers: Approver[];
  status: PurchaseRequestStatus;
  createdAt: string;
}

export interface Approval {
  id: string;
  purchaseRequestId: string;
  approverId: string;
  approvalToken: string;
  status: ApprovalStatus;
  otpCode?: string | null;
  otpExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  signedAt?: string | null;
  signedBy?: string | null;
}

export interface OtpResponse {
  message: string;
  approvalId: string;
  otpCode: string;
  otpExpiresAt: string;
}

export interface ValidateOtpResponse {
  message: string;
  approvalId: string;
  purchaseRequestId: string;
  approverId: string;
}
