import type { ComponentType } from "react";
import { Globe, Radar, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AuditResponse } from "@/types/audit";

type SummaryHeaderProps = {
  response: Extract<AuditResponse, { success: true }>["data"];
};

function deriveVerdict(wordCount: number, recommendationCount: number) {
  if (wordCount > 500 && recommendationCount <= 3) {
    return { label: "Strong foundation", variant: "good" as const };
  }
  if (recommendationCount >= 5) {
    return { label: "Needs refinement", variant: "warning" as const };
  }
  return { label: "Promising but uneven", variant: "mixed" as const };
}

export function SummaryHeader({ response }: SummaryHeaderProps) {
  const verdict = deriveVerdict(
    response.metrics.totalWordCount,
    response.insights.prioritizedRecommendations.length
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-6 p-6 md:grid-cols-[1.6fr,1fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={verdict.variant}>{verdict.label}</Badge>
            <Badge variant="neutral">{response.fetchStrategy === "html" ? "HTML fetch" : "Playwright render"}</Badge>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {response.metrics.metaTitle || response.metrics.contentPreview.title || "Untitled page"}
            </h2>
            <p className="max-w-3xl text-sm text-[#888888]">{response.metrics.finalUrl}</p>
            <p className="max-w-3xl text-base text-foreground/85">{response.insights.executiveSummary}</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-1">
          <StatBox icon={Radar} label="Word count" value={response.metrics.totalWordCount.toString()} />
          <StatBox
            icon={Workflow}
            label="Recommendations"
            value={response.insights.prioritizedRecommendations.length.toString()}
          />
          <StatBox icon={Globe} label="Final URL" value={response.metrics.finalUrl} compact />
        </div>
      </CardContent>
    </Card>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  compact = false
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-[4px] border border-white/10 bg-[#141414] p-4">
      <div className="mb-1 flex items-center gap-2 text-sm text-[#a0a0a0]">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className={compact ? "truncate text-sm text-foreground/90" : "text-2xl font-semibold text-foreground"}>{value}</div>
    </div>
  );
}
