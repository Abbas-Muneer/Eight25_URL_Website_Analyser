import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AiAuditResult, AuditInsight } from "@/types/audit";

type InsightsSectionProps = {
  insights: AiAuditResult;
};

const insightRows: Array<{ key: keyof Omit<AiAuditResult, "executiveSummary" | "prioritizedRecommendations">; title: string }> = [
  { key: "seoStructure", title: "SEO structure" },
  { key: "messagingClarity", title: "Messaging clarity" },
  { key: "ctaUsage", title: "CTA usage" },
  { key: "contentDepth", title: "Content depth" },
  { key: "uxStructuralConcerns", title: "UX and structure" }
];

export function InsightsSection({ insights }: InsightsSectionProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {insightRows.map(({ key, title }) => (
        <InsightCard key={key} title={title} insight={insights[key]} />
      ))}
    </div>
  );
}

function InsightCard({ title, insight }: { title: string; insight: AuditInsight }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>AI-generated, grounded in extracted metrics and excerpts.</CardDescription>
          </div>
          <Badge variant={insight.status}>{insight.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="border-l-2 border-[#2A5CFF] pl-4 text-sm leading-6 text-foreground/90">{insight.summary}</p>
        <div className="space-y-2">
          {insight.evidence.map((entry) => (
            <div key={entry} className="rounded-[4px] border border-white/10 bg-[#141414] px-4 py-3 text-sm text-[#a0a0a0]">
              {entry}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
