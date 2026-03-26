import type { CheerioAPI } from "cheerio";

import { cleanText, countWords, dedupeStrings, truncateText } from "@/lib/utils/text";

function removeNonContentNodes($: CheerioAPI) {
  $("script, style, noscript, svg, header, footer").remove();
}

export function extractContent($: CheerioAPI) {
  removeNonContentNodes($);

  const bodyText = cleanText($("body").text());
  const pageTitle = cleanText($("h1").first().text()) || cleanText($("title").first().text()) || null;

  const topHeadings = dedupeStrings(
    $("h1, h2, h3")
      .map((_, el) => cleanText($(el).text()))
      .get(),
    6
  );

  const firstParagraphs = dedupeStrings(
    $("p")
      .map((_, el) => cleanText($(el).text()))
      .get()
      .filter((text) => text.length > 40),
    3
  );

  return {
    totalWordCount: countWords(bodyText),
    contentPreview: {
      title: pageTitle,
      topHeadings,
      firstParagraphs,
      bodyExcerpt: truncateText(bodyText, 1400)
    }
  };
}
