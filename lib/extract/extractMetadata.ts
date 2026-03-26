import type { CheerioAPI } from "cheerio";

import { cleanText } from "@/lib/utils/text";

export function extractMetadata($: CheerioAPI) {
  const title = cleanText($("title").first().text()) || null;
  const metaDescription = cleanText($('meta[name="description"]').attr("content")) || null;

  return {
    metaTitle: title,
    metaDescription
  };
}
