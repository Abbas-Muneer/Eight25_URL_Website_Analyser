import { load } from "cheerio";

import { extractContent } from "@/lib/extract/extractContent";
import { extractCTAs } from "@/lib/extract/extractCTAs";
import { extractHeadings } from "@/lib/extract/extractHeadings";
import { extractImages } from "@/lib/extract/extractImages";
import { extractLinks } from "@/lib/extract/extractLinks";
import { extractMetadata } from "@/lib/extract/extractMetadata";
import { sanitizeHtml } from "@/lib/scrape/sanitizeHtml";
import { extractedMetricsSchema } from "@/lib/schemas/extractedMetricsSchema";
import type { ExtractedMetrics } from "@/types/audit";

export function extractMetrics(html: string, url: string, finalUrl: string): ExtractedMetrics {
  const sanitized = sanitizeHtml(html);
  const $ = load(sanitized);

  const metadata = extractMetadata($);
  const headings = extractHeadings($);
  const links = extractLinks($, finalUrl);
  const images = extractImages($);
  const ctas = extractCTAs($);
  const content = extractContent($);

  return extractedMetricsSchema.parse({
    url,
    finalUrl,
    ...metadata,
    headings,
    links,
    images,
    ctas,
    ...content
  });
}
