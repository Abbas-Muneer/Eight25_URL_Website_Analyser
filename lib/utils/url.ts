export function normalizeUrl(input: string): string {
  const raw = input.trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return new URL(withProtocol).toString();
}

export function safeDomain(input: string): string {
  try {
    const url = new URL(input);
    return url.hostname.replace(/[^a-z0-9.-]/gi, "-");
  } catch {
    return "unknown-domain";
  }
}

export function resolveHref(baseUrl: string, href: string | undefined): URL | null {
  if (!href) {
    return null;
  }

  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("javascript:") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
    return null;
  }

  try {
    return new URL(trimmed, baseUrl);
  } catch {
    return null;
  }
}

export function isInternalLink(baseUrl: string, targetUrl: URL): boolean {
  try {
    const base = new URL(baseUrl);
    return base.origin === targetUrl.origin;
  } catch {
    return false;
  }
}
