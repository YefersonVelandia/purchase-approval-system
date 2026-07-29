import { ApprovalStatus } from "../../domain/entities/approval.entity";

import { ApprovalRepository } from "../ports/approval.repository";

interface UpdateApprovalStatusInput {
  id: string;
  status: ApprovalStatus;
}

export class UpdateApprovalStatusUseCase {
  constructor(private readonly repository: ApprovalRepository) {}

  async execute(input: UpdateApprovalStatusInput) {
    const approval = await this.repository.findById(input.id);

    if (!approval) {
      throw new Error("Approval not found");
    }

    const updatedApproval = approval.changeStatus(input.status);

    await this.repository.updateStatus(input.id, updatedApproval);

    return updatedApproval.data;
  }
}
