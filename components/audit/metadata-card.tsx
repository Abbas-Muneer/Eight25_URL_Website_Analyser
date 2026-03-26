import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExtractedMetrics } from "@/types/audit";

type MetadataCardProps = {
  metrics: ExtractedMetrics;
};

export function MetadataCard({ metrics }: MetadataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
        <CardDescription>Raw metadata used for SEO and snippet analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetadataRow label="Meta title" value={metrics.metaTitle} />
        <MetadataRow label="Meta description" value={metrics.metaDescription} />
        <MetadataRow label="Top headings" value={metrics.contentPreview.topHeadings.join(" / ") || null} />
      </CardContent>
    </Card>
  );
}

function MetadataRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-[4px] border border-white/10 bg-[#141414] p-4">
      <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#888888]">{label}</p>
      <p className="text-sm leading-6 text-foreground/90">{value || "Unavailable"}</p>
    </div>
  );
}
