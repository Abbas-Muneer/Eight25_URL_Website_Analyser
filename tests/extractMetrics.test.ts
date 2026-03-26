import { describe, expect, it } from "vitest";

import { extractMetrics } from "@/lib/extract/extractMetrics";

import { sampleHtml } from "./fixtures/sampleHtml";

describe("extractMetrics", () => {
  const metrics = extractMetrics(sampleHtml, "https://eight25.example", "https://eight25.example");

  it("extracts heading counts", () => {
    expect(metrics.headings).toEqual({ h1: 1, h2: 2, h3: 1 });
  });

  it("classifies internal and external links", () => {
    expect(metrics.links).toEqual({ total: 5, internal: 4, external: 1 });
  });

  it("computes image alt coverage", () => {
    expect(metrics.images.total).toBe(2);
    expect(metrics.images.missingAlt).toBe(1);
    expect(metrics.images.missingAltPercent).toBe(50);
  });

  it("finds CTA candidates without overcounting navigation", () => {
    expect(metrics.ctas.count).toBe(2);
    expect(metrics.ctas.samples).toEqual(["Book a demo", "Talk to us"]);
  });

  it("extracts metadata", () => {
    expect(metrics.metaTitle).toBe("Premium Digital Studio");
    expect(metrics.metaDescription).toBe("We build high-performing marketing websites for ambitious brands.");
  });
});
