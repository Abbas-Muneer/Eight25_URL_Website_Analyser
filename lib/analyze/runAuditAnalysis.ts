import { writePromptLog } from "@/lib/logging/writePromptLog";
import { buildAuditPrompt } from "@/lib/prompts/buildAuditPrompt";
import { systemPrompt } from "@/lib/prompts/systemPrompt";
import { aiAuditSchema } from "@/lib/schemas/aiAuditSchema";
import { AppError } from "@/lib/utils/errors";
import type { AiAuditResult, ExtractedMetrics, PromptTrace } from "@/types/audit";

import { createOllamaChatCompletion } from "./ollamaClient";

const auditJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    executiveSummary: { type: "string" },
    seoStructure: insightSchema(),
    messagingClarity: insightSchema(),
    ctaUsage: insightSchema(),
    contentDepth: insightSchema(),
    uxStructuralConcerns: insightSchema(),
    prioritizedRecommendations: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          priority: { type: "string", enum: ["high", "medium", "low"] },
          title: { type: "string" },
          rationale: { type: "string" },
          action: { type: "string" }
        },
        required: ["priority", "title", "rationale", "action"]
      }
    }
  },
  required: [
    "executiveSummary",
    "seoStructure",
    "messagingClarity",
    "ctaUsage",
    "contentDepth",
    "uxStructuralConcerns",
    "prioritizedRecommendations"
  ]
};

function insightSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      status: { type: "string", enum: ["good", "warning", "poor", "mixed"] },
      summary: { type: "string" },
      evidence: {
        type: "array",
        items: { type: "string" },
        maxItems: 5
      }
    },
    required: ["status", "summary", "evidence"]
  };
}

function createTrace(url: string, structuredInput: Record<string, unknown>, userPrompt: string): PromptTrace {
  const timestamp = new Date().toISOString();
  return {
    id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp,
    url,
    systemPrompt,
    userPrompt,
    structuredInput,
    rawModelOutput: "",
    parsedOutput: null,
    logFilePath: null
  };
}

export async function runAuditAnalysis(metrics: ExtractedMetrics): Promise<{
  insights: AiAuditResult;
  trace: PromptTrace;
}> {
  const { structuredInput, userPrompt } = buildAuditPrompt(metrics);
  const trace = createTrace(metrics.finalUrl, structuredInput, userPrompt);

  try {
    const completion = await createOllamaChatCompletion({
      model: process.env.OLLAMA_MODEL || "llama3.1:8b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      stream: false,
      format: auditJsonSchema,
      options: {
        temperature: 0.2
      }
    });

    const raw = completion.message?.content ?? "";
    trace.rawModelOutput = raw;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new AppError("AI_PARSE_FAILED", "The AI response could not be parsed as JSON.", raw);
    }

    const insights = aiAuditSchema.parse(parsed);
    trace.parsedOutput = insights;
    trace.logFilePath = await writePromptLog(trace);

    return {
      insights,
      trace
    };
  } catch (error) {
    trace.rawModelOutput = trace.rawModelOutput || (error instanceof Error ? error.message : "Unknown AI error");
    trace.logFilePath = await writePromptLog(trace);

    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "ZodError") {
      throw new AppError("AI_SCHEMA_INVALID", "The AI response did not match the expected schema.", error.message);
    }

    const message = error instanceof Error ? error.message : "Unknown AI error";
    throw new AppError("AI_ANALYSIS_FAILED", "AI analysis failed.", message);
  }
}
