import type { CheerioAPI } from "cheerio";

export function extractHeadings($: CheerioAPI) {
  return {
    h1: $("h1").length,
    h2: $("h2").length,
    h3: $("h3").length
  };
}
