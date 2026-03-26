import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExtractedMetrics } from "@/types/audit";

type LinkAnalysisCardProps = {
  metrics: ExtractedMetrics;
};

export function LinkAnalysisCard({ metrics }: LinkAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Links and CTAs</CardTitle>
        <CardDescription>Navigation and conversion-oriented link analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Total links" value={metrics.links.total} />
          <Stat label="Internal links" value={metrics.links.internal} />
          <Stat label="External links" value={metrics.links.external} />
        </div>
        <div className="rounded-[4px] border border-white/10 bg-[#141414] p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#888888]">CTA samples</p>
          <div className="flex flex-wrap gap-2">
            {metrics.ctas.samples.length ? (
              metrics.ctas.samples.map((sample) => (
                <span key={sample} className="rounded-[4px] border border-white/10 bg-black px-3 py-1 text-sm text-white">
                  {sample}
                </span>
              ))
            ) : (
              <span className="text-sm text-[#a0a0a0]">No clear CTA candidates detected.</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[4px] border border-white/10 bg-[#141414] p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-[#a0a0a0]">{label}</div>
    </div>
  );
}
