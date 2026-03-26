import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockInsightResult } from "@/lib/analyze/__mocks__/mockInsightResult";
import { POST } from "@/app/api/audit/route";

const fetchPageMock = vi.fn();
const runAuditAnalysisMock = vi.fn();

vi.mock("@/lib/fetch/fetchPage", () => ({
  fetchPage: (...args: unknown[]) => fetchPageMock(...args)
}));

vi.mock("@/lib/analyze/runAuditAnalysis", () => ({
  runAuditAnalysis: (...args: unknown[]) => runAuditAnalysisMock(...args)
}));

describe("POST /api/audit", () => {
  beforeEach(() => {
    fetchPageMock.mockReset();
    runAuditAnalysisMock.mockReset();
  });

  it("returns a grounded audit payload", async () => {
    fetchPageMock.mockResolvedValue({
      html: `
        <html><head><title>Example</title></head><body><main><h1>Headline</h1><p>Example copy for testing.</p><button>Book a demo</button></main></body></html>
      `,
      finalUrl: "https://example.com",
      strategy: "html",
      status: 200
    });

    runAuditAnalysisMock.mockResolvedValue({
      insights: mockInsightResult,
      trace: {
        id: "trace-1",
        timestamp: "2026-03-26T00:00:00.000Z",
        url: "https://example.com",
        systemPrompt: "system",
        userPrompt: "user",
        structuredInput: { extractedMetrics: { url: "https://example.com" } },
        rawModelOutput: JSON.stringify(mockInsightResult),
        parsedOutput: mockInsightResult,
        logFilePath: "prompt-logs/test.json"
      }
    });

    const response = await POST(
      new Request("http://localhost:3000/api/audit", {
        method: "POST",
        body: JSON.stringify({ url: "example.com" }),
        headers: {
          "content-type": "application/json"
        }
      })
    );

    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.insights.executiveSummary).toContain("premium service");
    expect(json.data.fetchStrategy).toBe("html");
    expect(json.data.metrics.headings.h1).toBe(1);
  });

  it("rejects invalid URLs", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/audit", {
        method: "POST",
        body: JSON.stringify({ url: "not a url" }),
        headers: {
          "content-type": "application/json"
        }
      })
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
  });
});
