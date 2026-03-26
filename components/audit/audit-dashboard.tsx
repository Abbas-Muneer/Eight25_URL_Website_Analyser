"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { ImageAnalysisCard } from "@/components/audit/image-analysis-card";
import { InsightsSection } from "@/components/audit/insights-section";
import { LinkAnalysisCard } from "@/components/audit/link-analysis-card";
import { LoadingState } from "@/components/audit/loading-state";
import { MetadataCard } from "@/components/audit/metadata-card";
import { MetricsGrid } from "@/components/audit/metrics-grid";
import { RecommendationsSection } from "@/components/audit/recommendations-section";
import { SectionShell } from "@/components/audit/section-shell";
import { SummaryHeader } from "@/components/audit/summary-header";
import { TracePanel } from "@/components/audit/trace-panel";
import { UrlForm } from "@/components/audit/url-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { normalizeUrl } from "@/lib/utils/url";
import type { AuditResponse } from "@/types/audit";

export function AuditDashboard() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Website Audit Tool";
  const [data, setData] = useState<Extract<AuditResponse, { success: true }>["data"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(input: string) {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const normalized = normalizeUrl(input);
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ url: normalized })
      });
      const json = (await response.json()) as AuditResponse;

      if (!json.success) {
        throw new Error(json.error.message);
      }

      setData(json.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Audit failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <section className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(13,13,13,0.98),rgba(0,0,0,0.98))] px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:px-10 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(42,92,255,0.18),transparent_20%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2A5CFF]/80 to-transparent" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:items-end">
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-[4px] border border-white/10 bg-[#1a1a1a] px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#a0a0a0]">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              EIGHT25 internal intelligence tool
            </div>
            <div className="space-y-4">
              <h1 className="max-w-4xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {appName}: premium single-page website audits with grounded AI analysis.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#a0a0a0] sm:text-lg">
                Scrape one URL, extract factual metrics, then generate structured strategic insights with full prompt
                transparency. Facts and AI output stay cleanly separated end to end.
              </p>
            </div>
            <UrlForm onSubmit={handleSubmit} isLoading={loading} error={error} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="relative grid gap-4"
          >
            <Card className="border-white/10 bg-[#111111]/95">
              <CardContent className="grid gap-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#888888]">Pipeline</p>
                    <p className="mt-2 text-lg font-semibold text-white">Fetch, extract, analyze, trace.</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-accent" />
                </div>
                <div className="grid gap-3 text-sm text-[#a0a0a0]">
                  <FeatureLine>Fast HTML fetch with Playwright fallback</FeatureLine>
                  <FeatureLine>Strict Zod validation for facts and AI outputs</FeatureLine>
                  <FeatureLine>Local prompt logs for evaluator inspection</FeatureLine>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-[#111111]/95">
              <CardContent className="p-6">
                <div className="mb-3 text-xs uppercase tracking-[0.24em] text-[#888888]">Coverage</div>
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat label="SEO structure" />
                  <MiniStat label="Messaging" />
                  <MiniStat label="CTA quality" />
                  <MiniStat label="UX concerns" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <div className="mt-8 space-y-8">
        {loading ? <LoadingState /> : null}

        {error && !loading ? (
          <Card className="border-rose-400/20 bg-rose-400/10">
            <CardContent className="flex items-start gap-4 p-6">
              <AlertCircle className="mt-1 h-5 w-5 text-rose-200" />
              <div className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-white">Audit could not be completed</h2>
                <p className="text-sm text-rose-100/90">{error}</p>
                <Button variant="secondary" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {data ? (
          <div className="space-y-8">
            <SummaryHeader response={data} />

            <SectionShell
              eyebrow="Factual metrics"
              title="Scraped page facts"
              description="Directly extracted metrics and structured page context. Nothing in this section is AI-generated."
            >
              <MetricsGrid metrics={data.metrics} />
              <div className="grid gap-5 xl:grid-cols-3">
                <MetadataCard metrics={data.metrics} />
                <LinkAnalysisCard metrics={data.metrics} />
                <ImageAnalysisCard metrics={data.metrics} />
              </div>
            </SectionShell>

            <SectionShell
              eyebrow="AI insights"
              title="Grounded strategic analysis"
              description="Structured model output generated only from the extracted metrics and curated page excerpts."
            >
              <InsightsSection insights={data.insights} />
            </SectionShell>

            <SectionShell
              eyebrow="Recommendations"
              title="Prioritized next moves"
              description="Actionable recommendations ordered for practical execution and tied back to the observed page facts."
            >
              <RecommendationsSection recommendations={data.insights.prioritizedRecommendations} />
            </SectionShell>

            <SectionShell
              eyebrow="Trace"
              title="Prompt and output transparency"
              description="Inspectable system prompt, user prompt, structured input, raw model output, and parsed JSON."
            >
              <TracePanel trace={data.trace} />
            </SectionShell>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function FeatureLine({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[4px] border border-white/10 bg-[#1a1a1a] px-4 py-3">
      <p>{children}</p>
    </div>
  );
}

function MiniStat({ label }: { label: string }) {
  return (
    <div className="rounded-[4px] border border-white/10 bg-[#1a1a1a] px-4 py-4 text-sm text-[#a0a0a0]">
      {label}
    </div>
  );
}
