import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";

import { cleanText, dedupeStrings } from "@/lib/utils/text";

const CTA_COPY_PATTERN =
  /\b(contact|get started|book|schedule|request|demo|call|buy|start|subscribe|sign up|learn more|talk to us|free trial|let's talk|try now|see pricing)\b/i;
const CTA_CLASS_PATTERN = /\b(btn|button|cta|primary|hero-action|call-to-action)\b/i;

function looksLikeCta($: CheerioAPI, element: Element) {
  const node = $(element);
  const text = cleanText(node.text());
  const className = node.attr("class") ?? "";
  const role = node.attr("role") ?? "";
  const ariaLabel = node.attr("aria-label") ?? "";
  const combinedText = `${text} ${ariaLabel}`.trim();

  if (node.is("button")) {
    return true;
  }

  if (!node.is("a")) {
    return false;
  }

  if (CTA_CLASS_PATTERN.test(className) || role === "button") {
    return true;
  }

  if (!combinedText || combinedText.split(" ").length > 5) {
    return false;
  }

  return CTA_COPY_PATTERN.test(combinedText);
}

export function extractCTAs($: CheerioAPI) {
  const ctaTexts: string[] = [];

  $("button, a").each((_, element) => {
    if (!looksLikeCta($, element)) {
      return;
    }

    const text = cleanText($(element).attr("aria-label")) || cleanText($(element).text());
    if (text) {
      ctaTexts.push(text);
    }
  });

  const samples = dedupeStrings(ctaTexts, 6);

  return {
    count: samples.length === 0 ? 0 : ctaTexts.length,
    samples
  };
}
