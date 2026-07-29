import { z } from "zod";

export const createPurchaseRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  amount: z.number().positive(),
  requesterId: z.string().min(1),
});

export type CreatePurchaseRequestInput = z.infer<typeof createPurchaseRequestSchema>;
