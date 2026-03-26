import type { ExtractedMetrics } from "@/types/audit";

export function buildAuditPrompt(metrics: ExtractedMetrics) {
  const structuredInput = {
    extractedMetrics: metrics
  };

  const userPrompt = `Analyze this single-page website audit payload.

Required output shape:
{
  "executiveSummary": string,
  "seoStructure": { "status": "good" | "warning" | "poor" | "mixed", "summary": string, "evidence": string[] },
  "messagingClarity": { "status": "good" | "warning" | "poor" | "mixed", "summary": string, "evidence": string[] },
  "ctaUsage": { "status": "good" | "warning" | "poor" | "mixed", "summary": string, "evidence": string[] },
  "contentDepth": { "status": "good" | "warning" | "poor" | "mixed", "summary": string, "evidence": string[] },
  "uxStructuralConcerns": { "status": "good" | "warning" | "poor" | "mixed", "summary": string, "evidence": string[] },
  "prioritizedRecommendations": [
    { "priority": "high" | "medium" | "low", "title": string, "rationale": string, "action": string }
  ]
}

Constraints:
- Produce 3 to 5 recommendations.
- Reference extracted facts directly where relevant.
- Do not mention metrics that are not present in the input.
- Do not assume multi-page context or sitewide behavior.
- Keep all copy executive-ready and concise.

Audit payload:
${JSON.stringify(structuredInput, null, 2)}`;

  return {
    structuredInput,
    userPrompt
  };
}
