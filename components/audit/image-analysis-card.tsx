import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExtractedMetrics } from "@/types/audit";

type ImageAnalysisCardProps = {
  metrics: ExtractedMetrics;
};

export function ImageAnalysisCard({ metrics }: ImageAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media accessibility</CardTitle>
        <CardDescription>Image counts and alt text coverage from the extracted DOM.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Images" value={metrics.images.total} />
          <Stat label="Missing alt" value={metrics.images.missingAlt} />
          <Stat label="Missing alt %" value={metrics.images.missingAltPercent} suffix="%" />
        </div>
        <div className="rounded-[4px] border border-white/10 bg-[#141414] p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#888888]">Alt text samples</p>
          <p className="text-sm text-foreground/90">
            {metrics.images.altSamples.length ? metrics.images.altSamples.join(" / ") : "No alt text samples captured."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-[4px] border border-white/10 bg-[#141414] p-4">
      <div className="text-2xl font-semibold">
        {value}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-[#a0a0a0]">{label}</div>
    </div>
  );
}
