import { z } from "zod";

export const auditRequestSchema = z.object({
  url: z.string().trim().min(1)
});
