import { Approver } from "../../domain/entities/purchase-request.entity";

export interface CreatePurchaseRequestDto {
  title: string;
  description: string;
  amount: number;
  requesterId: string;
  approvers: Approver[];
}
