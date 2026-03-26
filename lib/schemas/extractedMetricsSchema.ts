import { z } from "zod";

export const extractedMetricsSchema = z.object({
  url: z.string().url(),
  finalUrl: z.string().url(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  totalWordCount: z.number().int().nonnegative(),
  headings: z.object({
    h1: z.number().int().nonnegative(),
    h2: z.number().int().nonnegative(),
    h3: z.number().int().nonnegative()
  }),
  ctas: z.object({
    count: z.number().int().nonnegative(),
    samples: z.array(z.string()).max(8)
  }),
  links: z.object({
    total: z.number().int().nonnegative(),
    internal: z.number().int().nonnegative(),
    external: z.number().int().nonnegative()
  }),
  images: z.object({
    total: z.number().int().nonnegative(),
    missingAlt: z.number().int().nonnegative(),
    missingAltPercent: z.number().nonnegative(),
    altSamples: z.array(z.string()).max(8)
  }),
  contentPreview: z.object({
    title: z.string().nullable(),
    topHeadings: z.array(z.string()).max(10),
    firstParagraphs: z.array(z.string()).max(3),
    bodyExcerpt: z.string()
  })
});

export type ExtractedMetricsInput = z.infer<typeof extractedMetricsSchema>;
