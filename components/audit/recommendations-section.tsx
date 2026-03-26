import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recommendation } from "@/types/audit";

type RecommendationsSectionProps = {
  recommendations: Recommendation[];
};

const variantByPriority = {
  high: "poor",
  medium: "warning",
  low: "mixed"
} as const;

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  return (
    <div className="grid gap-4">
      {recommendations.map((recommendation, index) => (
        <Card key={`${recommendation.title}-${index}`} className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{recommendation.title}</CardTitle>
                <CardDescription>{recommendation.rationale}</CardDescription>
              </div>
              <Badge variant={variantByPriority[recommendation.priority]}>{recommendation.priority}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex items-start gap-3 border-t border-white/10 pt-6">
            <div className="mt-0.5 rounded-[4px] border border-white/10 bg-black p-2">
              <ArrowUpRight className="h-4 w-4 text-accent" />
            </div>
            <p className="text-sm leading-6 text-foreground/90">{recommendation.action}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
