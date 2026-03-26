import type { ComponentType } from "react";
import { BarChart3, ImageIcon, Link2, Type } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExtractedMetrics } from "@/types/audit";

type MetricsGridProps = {
  metrics: ExtractedMetrics;
};

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const chartData = [
    { label: "H1", value: metrics.headings.h1 },
    { label: "H2", value: metrics.headings.h2 },
    { label: "H3", value: metrics.headings.h3 }
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Factual metrics</CardTitle>
          <CardDescription>Scraped directly from the page without AI inference.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Type} label="Total words" value={metrics.totalWordCount.toString()} />
          <MetricCard icon={BarChart3} label="CTA count" value={metrics.ctas.count.toString()} />
          <MetricCard icon={Link2} label="Internal links" value={metrics.links.internal.toString()} />
          <MetricCard icon={ImageIcon} label="Images missing alt" value={`${metrics.images.missingAltPercent}%`} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Heading structure</CardTitle>
          <CardDescription>Counts for the first three heading levels.</CardDescription>
        </CardHeader>
        <CardContent className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="label" stroke="rgba(160,160,160,0.9)" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="rgba(160,160,160,0.9)" tickLine={false} axisLine={false} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="rgba(42, 92, 255, 0.92)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[4px] border border-white/10 bg-[#141414] p-4">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[4px] border border-white/10 bg-black">
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      <p className="mt-1 text-sm text-[#a0a0a0]">{label}</p>
    </div>
  );
}
