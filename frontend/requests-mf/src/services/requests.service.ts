import axios from "axios";
import type { PurchaseRequest, CreatePurchaseRequestPayload, Approval } from "../types/request.types";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const requestsService = {
  list: (): Promise<PurchaseRequest[]> =>
    httpClient.get("/purchase-requests").then((res) => res.data),

  getById: (id: string): Promise<PurchaseRequest> =>
    httpClient.get(`/purchase-requests/${id}`).then((res) => res.data),

  create: (payload: CreatePurchaseRequestPayload): Promise<PurchaseRequest> =>
    httpClient.post("/purchase-requests", payload).then((res) => res.data),

  getApprovals: (purchaseRequestId: string): Promise<Approval[]> =>
    httpClient.get(`/purchase-requests/${purchaseRequestId}/approvals`).then((res) => res.data),
};
