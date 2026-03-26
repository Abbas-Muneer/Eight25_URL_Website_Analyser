import type { CheerioAPI } from "cheerio";

import { cleanText, dedupeStrings } from "@/lib/utils/text";

export function extractImages($: CheerioAPI) {
  const images = $("img");
  let missingAlt = 0;
  const altSamples: string[] = [];

  images.each((_, element) => {
    const alt = cleanText($(element).attr("alt"));
    if (!alt) {
      missingAlt += 1;
      return;
    }

    altSamples.push(alt);
  });

  const total = images.length;
  const missingAltPercent = total === 0 ? 0 : Number(((missingAlt / total) * 100).toFixed(1));

  return {
    total,
    missingAlt,
    missingAltPercent,
    altSamples: dedupeStrings(altSamples, 6)
  };
}
