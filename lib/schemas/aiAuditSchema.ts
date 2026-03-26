import { z } from "zod";

export const auditInsightSchema = z.object({
  status: z.enum(["good", "warning", "poor", "mixed"]),
  summary: z.string().min(1).max(600),
  evidence: z.array(z.string().min(1).max(240)).max(5)
});

export const recommendationSchema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  title: z.string().min(1).max(120),
  rationale: z.string().min(1).max(240),
  action: z.string().min(1).max(240)
});

export const aiAuditSchema = z.object({
  executiveSummary: z.string().min(1).max(700),
  seoStructure: auditInsightSchema,
  messagingClarity: auditInsightSchema,
  ctaUsage: auditInsightSchema,
  contentDepth: auditInsightSchema,
  uxStructuralConcerns: auditInsightSchema,
  prioritizedRecommendations: z.array(recommendationSchema).min(3).max(5)
});

export type AiAuditSchemaInput = z.infer<typeof aiAuditSchema>;
