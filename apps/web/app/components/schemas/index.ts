import { z } from "zod";

export const dealScreenSchema = z.object({
  approvalStatus: z.enum(["Approved", "Rejected"]), // Status of deal screening
  explanation: z.string(), // Explanation for why the deal was approved or rejected
});

export type DealScreen = z.infer<typeof dealScreenSchema>;
