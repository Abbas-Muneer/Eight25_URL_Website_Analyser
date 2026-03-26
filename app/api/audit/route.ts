import { NextResponse } from "next/server";

import { runAuditAnalysis } from "@/lib/analyze/runAuditAnalysis";
import { extractMetrics } from "@/lib/extract/extractMetrics";
import { fetchPage } from "@/lib/fetch/fetchPage";
import { auditRequestSchema } from "@/lib/schemas/auditRequestSchema";
import { toErrorResponse } from "@/lib/utils/errors";
import { normalizeUrl } from "@/lib/utils/url";
import type { AuditResponse } from "@/types/audit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = auditRequestSchema.parse(await request.json());
    const normalizedUrl = normalizeUrl(body.url);
    const page = await fetchPage(normalizedUrl);
    const metrics = extractMetrics(page.html, normalizedUrl, page.finalUrl);
    const { insights, trace } = await runAuditAnalysis(metrics);

    const response: AuditResponse = {
      success: true,
      data: {
        metrics,
        insights,
        trace,
        fetchStrategy: page.strategy
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(toErrorResponse(error), { status: 400 });
  }
}
