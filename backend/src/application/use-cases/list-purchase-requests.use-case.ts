import { PurchaseRequestRepository } from "../ports/purchase-request.repository";

export class ListPurchaseRequestsUseCase {
  constructor(private readonly repository: PurchaseRequestRepository) {}

  async execute() {
    const requests = await this.repository.findAll();

    return requests.map((request) => request.data);
  }
}
