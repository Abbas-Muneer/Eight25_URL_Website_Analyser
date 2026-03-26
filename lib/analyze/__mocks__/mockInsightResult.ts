import type { AiAuditResult } from "@/types/audit";

export const mockInsightResult: AiAuditResult = {
  executiveSummary:
    "The page communicates a premium service offer with solid intent, but its structure and CTA coverage leave room for a clearer conversion path.",
  seoStructure: {
    status: "warning",
    summary: "The page has a single H1 and supporting H2s, but metadata depth and content breadth are modest.",
    evidence: ["1 H1 detected", "2 H2s detected", "Meta description is present"]
  },
  messagingClarity: {
    status: "good",
    summary: "The opening copy explains the offer and target outcome clearly in plain business language.",
    evidence: ["Body excerpt references premium websites", "First paragraphs describe value and approach"]
  },
  ctaUsage: {
    status: "warning",
    summary: "CTAs exist, but there are only a few clear actions relative to the page length.",
    evidence: ["2 CTA candidates detected", "CTA samples include Book a demo and Talk to us"]
  },
  contentDepth: {
    status: "mixed",
    summary: "The page has enough copy to frame the offer, but the depth is limited for a higher-trust evaluation page.",
    evidence: ["Word count is below long-form service page norms", "Only a small set of headings is present"]
  },
  uxStructuralConcerns: {
    status: "warning",
    summary: "The page looks concise, but the structure may rely on a short scan instead of layered proof and pathing.",
    evidence: ["Limited number of sections inferred from headings", "CTA coverage appears concentrated"]
  },
  prioritizedRecommendations: [
    {
      priority: "high",
      title: "Strengthen the primary conversion path",
      rationale: "Only two clear CTAs were detected, which may limit conversion opportunities across the page.",
      action: "Add one persistent primary CTA and reinforce it in a mid-page section tied to the core offer."
    },
    {
      priority: "high",
      title: "Expand supporting proof content",
      rationale: "The page structure is concise and may not provide enough depth for evaluators comparing premium vendors.",
      action: "Add proof-driven sections such as outcomes, process, or client validation beneath the hero."
    },
    {
      priority: "medium",
      title: "Improve image accessibility coverage",
      rationale: "Half of the images are missing alt text in the sample audit, which weakens accessibility and content semantics.",
      action: "Add descriptive alt text for all informative imagery and leave decorative assets explicitly empty when appropriate."
    }
  ]
};
