import { PurchaseRequestRepository } from "../ports/purchase-request.repository";

export class GetPurchaseRequestUseCase {
  constructor(private readonly repository: PurchaseRequestRepository) {}

  async execute(id: string) {
    const request = await this.repository.findById(id);

    if (!request) {
      throw new Error("Purchase request not found");
    }

    return request.data;
  }
}
