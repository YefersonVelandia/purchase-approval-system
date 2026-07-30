import axios from "axios";
import type { PurchaseRequest, OtpResponse, ValidateOtpResponse } from "../types/approval.types";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const approvalService = {
  getPurchaseRequest: (id: string): Promise<PurchaseRequest> =>
    httpClient.get(`/purchase-requests/${id}`).then((res) => res.data),

  generateOtp: (token: string): Promise<OtpResponse> =>
    httpClient.get(`/approvals/${token}/otp`).then((res) => res.data),

  validateOtp: (token: string, otpCode: string): Promise<ValidateOtpResponse> =>
    httpClient.post(`/approvals/${token}/validate-otp`, { otpCode }).then((res) => res.data),

  updateApprovalStatus: (
    id: string,
    status: "APPROVED" | "REJECTED",
    signedBy: string,
  ): Promise<unknown> =>
    httpClient.patch(`/approvals/${id}`, { status, signedBy }).then((res) => res.data),
};
