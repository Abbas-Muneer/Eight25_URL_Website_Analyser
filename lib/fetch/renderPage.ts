import { chromium } from "playwright";

type RenderPageOptions = {
  timeoutMs?: number;
};

export async function renderPage(url: string, options: RenderPageOptions = {}) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 1080
    }
  });

  try {
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: options.timeoutMs ?? 15000
    });
    const html = await page.content();

    return {
      html,
      finalUrl: page.url(),
      status: response?.status() ?? 200
    };
  } finally {
    await page.close();
    await browser.close();
  }
}
