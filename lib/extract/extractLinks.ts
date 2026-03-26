import type { CheerioAPI } from "cheerio";

import { isInternalLink, resolveHref } from "@/lib/utils/url";

export function extractLinks($: CheerioAPI, baseUrl: string) {
  let internal = 0;
  let external = 0;

  $("a[href]").each((_, element) => {
    const resolved = resolveHref(baseUrl, $(element).attr("href"));
    if (!resolved) {
      return;
    }

    if (isInternalLink(baseUrl, resolved)) {
      internal += 1;
      return;
    }

    external += 1;
  });

  return {
    total: internal + external,
    internal,
    external
  };
}
