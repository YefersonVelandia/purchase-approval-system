import { Approval, ApprovalStatus } from "../../domain/entities/approval.entity";

import { ApprovalRepository } from "../ports/approval.repository";

import { randomUUID } from "crypto";

interface CreateApprovalInput {
  purchaseRequestId: string;
  approverId: string;
}

export class CreateApprovalUseCase {
  constructor(private readonly repository: ApprovalRepository) {}

  async execute(input: CreateApprovalInput) {
    const approval = Approval.create({
      id: randomUUID(),
      purchaseRequestId: input.purchaseRequestId,
      approverId: input.approverId,
      status: ApprovalStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.repository.save(approval);

    return approval.data;
  }
}
