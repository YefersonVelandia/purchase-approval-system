import { createPurchaseRequestSchema } from "../../application/dto/create-purchase-request.schema";
import { CreatePurchaseRequestUseCase } from "../../application/use-cases/create-purchase-request.use-case";

export class CreatePurchaseRequestController {
  constructor(private readonly useCase: CreatePurchaseRequestUseCase) {}

  async execute(body: unknown) {
    const input = createPurchaseRequestSchema.parse(body);

    const result = await this.useCase.execute(input);

    return {
      statusCode: 201,
      body: JSON.stringify(result.data),
    };
  }
}
