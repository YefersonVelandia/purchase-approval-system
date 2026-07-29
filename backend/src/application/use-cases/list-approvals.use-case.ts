import { ApprovalRepository } from "../ports/approval.repository";

export class ListApprovalsUseCase {
  constructor(private readonly repository: ApprovalRepository) {}

  async execute(purchaseRequestId: string) {
    const approvals = await this.repository.findByPurchaseRequestId(purchaseRequestId);

    return approvals.map((approval) => approval.data);
  }
}
