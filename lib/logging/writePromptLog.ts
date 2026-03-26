import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { safeDomain } from "@/lib/utils/url";
import type { PromptTrace } from "@/types/audit";

function shouldWriteLogs() {
  return process.env.NODE_ENV !== "production";
}

function buildMarkdown(trace: PromptTrace) {
  return `# Audit Trace

- Timestamp: ${trace.timestamp}
- URL: ${trace.url}
- Trace ID: ${trace.id}

## System Prompt

\`\`\`
${trace.systemPrompt}
\`\`\`

## User Prompt

\`\`\`
${trace.userPrompt}
\`\`\`

## Structured Input

\`\`\`json
${JSON.stringify(trace.structuredInput, null, 2)}
\`\`\`

## Raw Model Output

\`\`\`
${trace.rawModelOutput}
\`\`\`

## Parsed Output

\`\`\`json
${JSON.stringify(trace.parsedOutput, null, 2)}
\`\`\`
`;
}

export async function writePromptLog(trace: PromptTrace) {
  if (!shouldWriteLogs()) {
    return null;
  }

  const dir = path.join(process.cwd(), "prompt-logs");
  await mkdir(dir, { recursive: true });

  const timestamp = trace.timestamp.replace(/[:]/g, "-").replace(/\..+$/, "");
  const basename = `${timestamp}_${safeDomain(trace.url)}`;
  const jsonPath = path.join(dir, `${basename}.json`);
  const markdownPath = path.join(dir, `${basename}.md`);

  await writeFile(jsonPath, JSON.stringify(trace, null, 2), "utf8");
  await writeFile(markdownPath, buildMarkdown(trace), "utf8");

  return jsonPath;
}
