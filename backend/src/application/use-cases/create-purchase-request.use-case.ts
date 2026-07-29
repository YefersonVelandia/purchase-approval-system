import { randomUUID } from "node:crypto";

import {
  PurchaseRequest,
  PurchaseRequestStatus,
} from "../../domain/entities/purchase-request.entity";

import { PurchaseRequestRepository } from "../ports/purchase-request.repository";
import { CreatePurchaseRequestDto } from "../dto/create-purchase-request.dto";

export class CreatePurchaseRequestUseCase {
  constructor(private readonly repository: PurchaseRequestRepository) {}

  async execute(input: CreatePurchaseRequestDto): Promise<PurchaseRequest> {
    const purchaseRequest = PurchaseRequest.create({
      id: randomUUID(),
      title: input.title,
      description: input.description,
      amount: input.amount,
      requesterId: input.requesterId,
      status: PurchaseRequestStatus.PENDING,
      createdAt: new Date(),
    });

    await this.repository.save(purchaseRequest);

    return purchaseRequest;
  }
}
