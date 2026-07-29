import { PurchaseRequestStatus } from "../../domain/entities/purchase-request.entity";
import { PurchaseRequestRepository } from "../ports/purchase-request.repository";

export class UpdatePurchaseRequestStatusUseCase {
  constructor(private readonly repository: PurchaseRequestRepository) {}

  async execute(id: string, status: PurchaseRequestStatus) {
    const request = await this.repository.findById(id);

    if (!request) {
      throw new Error("Purchase request not found");
    }

    const updatedRequest = request.changeStatus(status);

    await this.repository.updateStatus(id, updatedRequest.data.status);

    return updatedRequest.data;
  }
}
