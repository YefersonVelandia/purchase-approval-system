import { z } from "zod";
import { ApproverRole } from "../../domain/entities/purchase-request.entity";

const approverSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(ApproverRole),
});

export const createPurchaseRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  amount: z.number().positive(),
  requesterId: z.string().min(1),
  approvers: z.array(approverSchema).length(3),
});

export type CreatePurchaseRequestInput = z.infer<typeof createPurchaseRequestSchema>;
