import { AppError } from "@/lib/utils/errors";

import { renderPage } from "./renderPage";

type FetchPageResult = {
  html: string;
  finalUrl: string;
  strategy: "html" | "playwright";
  status: number;
};

type FetchPageOptions = {
  timeoutMs?: number;
};

function shouldFallbackToRender(html: string, status: number) {
  const trimmed = html.replace(/\s+/g, " ").trim();
  if (status >= 400) {
    return true;
  }

  if (trimmed.length < 800) {
    return true;
  }

  return !/<(main|h1|p|section|article)\b/i.test(trimmed);
}

export async function fetchPage(url: string, options: FetchPageOptions = {}): Promise<FetchPageResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 12000);
  let fallbackHtmlResult: FetchPageResult | null = null;

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "EIGHT25 Website Audit Tool/1.0 (+local)"
      },
      signal: controller.signal,
      redirect: "follow"
    });

    const html = await response.text();
    if (!shouldFallbackToRender(html, response.status)) {
      return {
        html,
        finalUrl: response.url,
        strategy: "html",
        status: response.status
      };
    }

    fallbackHtmlResult = {
      html,
      finalUrl: response.url,
      strategy: "html",
      status: response.status
    };
  } catch (error) {
    if (!(error instanceof Error && error.name === "AbortError")) {
      // Continue to fallback.
    }
  } finally {
    clearTimeout(timeout);
  }

  try {
    const rendered = await renderPage(url, options);
    return {
      html: rendered.html,
      finalUrl: rendered.finalUrl,
      strategy: "playwright",
      status: rendered.status
    };
  } catch (error) {
    if (fallbackHtmlResult) {
      return fallbackHtmlResult;
    }

    const message = error instanceof Error ? error.message : "Failed to fetch the page";
    throw new AppError("PAGE_FETCH_FAILED", "Unable to load the requested page.", message);
  }
}
