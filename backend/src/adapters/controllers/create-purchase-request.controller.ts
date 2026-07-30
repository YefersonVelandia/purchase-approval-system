import { CreatePurchaseRequestDto } from "../../application/dto/create-purchase-request.dto";
import { CreatePurchaseRequestUseCase } from "../../application/use-cases/create-purchase-request.use-case";

export class CreatePurchaseRequestController {
  constructor(private readonly useCase: CreatePurchaseRequestUseCase) {}

  async execute(body: CreatePurchaseRequestDto) {
    const result = await this.useCase.execute(body);

    return {
      statusCode: 201,
      body: JSON.stringify(result.data),
    };
  }
}
