export type AuditStatus = "good" | "warning" | "poor" | "mixed";
export type RecommendationPriority = "high" | "medium" | "low";

export type ExtractedMetrics = {
  url: string;
  finalUrl: string;
  metaTitle: string | null;
  metaDescription: string | null;
  totalWordCount: number;
  headings: {
    h1: number;
    h2: number;
    h3: number;
  };
  ctas: {
    count: number;
    samples: string[];
  };
  links: {
    total: number;
    internal: number;
    external: number;
  };
  images: {
    total: number;
    missingAlt: number;
    missingAltPercent: number;
    altSamples: string[];
  };
  contentPreview: {
    title: string | null;
    topHeadings: string[];
    firstParagraphs: string[];
    bodyExcerpt: string;
  };
};

export type AuditInsight = {
  status: AuditStatus;
  summary: string;
  evidence: string[];
};

export type Recommendation = {
  priority: RecommendationPriority;
  title: string;
  rationale: string;
  action: string;
};

export type AiAuditResult = {
  executiveSummary: string;
  seoStructure: AuditInsight;
  messagingClarity: AuditInsight;
  ctaUsage: AuditInsight;
  contentDepth: AuditInsight;
  uxStructuralConcerns: AuditInsight;
  prioritizedRecommendations: Recommendation[];
};

export type PromptTrace = {
  id: string;
  timestamp: string;
  url: string;
  systemPrompt: string;
  userPrompt: string;
  structuredInput: Record<string, unknown>;
  rawModelOutput: string;
  parsedOutput: AiAuditResult | null;
  logFilePath: string | null;
};

export type AuditResponse = {
  success: true;
  data: {
    metrics: ExtractedMetrics;
    insights: AiAuditResult;
    trace: PromptTrace;
    fetchStrategy: "html" | "playwright";
  };
} | {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
};
