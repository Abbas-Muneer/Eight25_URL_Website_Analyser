const WHITESPACE = /\s+/g;

export function cleanText(value: string | null | undefined): string {
  return (value ?? "").replace(WHITESPACE, " ").trim();
}

export function countWords(value: string): number {
  const cleaned = cleanText(value);
  return cleaned ? cleaned.split(" ").length : 0;
}

export function truncateText(value: string, maxLength: number): string {
  const cleaned = cleanText(value);
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}

export function dedupeStrings(values: string[], maxItems: number): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const normalized = cleanText(value);
    if (!normalized) {
      continue;
    }
    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(normalized);
    if (result.length >= maxItems) {
      break;
    }
  }

  return result;
}
