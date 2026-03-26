# EIGHT25 Website Audit Tool

An AI-powered single-page website audit application built for local-first evaluation. It extracts factual page metrics from one URL, then runs a grounded AI review that stays strictly separated from the scraper output. Every audit includes inspectable prompt traces for transparency.

## Overview

This project is designed around a strict fact-first pipeline:

1. Fetch the requested page
2. Extract deterministic factual metrics
3. Build a structured AI input payload
4. Generate structured strategic analysis
5. Validate the AI output with Zod
6. Render facts, insights, recommendations, and trace logs as clearly separate sections

The goal is not to build a crawler or generic SEO dashboard. It is a focused, single-page audit experience with strong transparency and maintainable architecture.

## Why This Architecture

The pipeline is intentionally split into two stages:

1. Deterministic extraction
2. AI analysis on top of extracted facts

That separation keeps factual metrics trustworthy, prevents invented numbers, and makes it easy for evaluators to inspect exactly what was scraped versus what was inferred by the model.

## Tech Stack

- Next.js 14 App Router
- TypeScript with strict mode
- Tailwind CSS
- Framer Motion
- Lucide icons
- Recharts
- Zod
- Cheerio
- Playwright
- Ollama HTTP API
- Vitest + Testing Library

## Project Structure

```text
.
|-- app/
|   |-- api/audit/route.ts
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- audit/
|   `-- ui/
|-- lib/
|   |-- analyze/
|   |-- extract/
|   |-- fetch/
|   |-- logging/
|   |-- prompts/
|   |-- schemas/
|   |-- scrape/
|   `-- utils/
|-- prompt-logs/
|-- tests/
|-- types/
|-- .env.example
|-- Dockerfile
|-- docker-compose.yml
|-- package.json
`-- README.md
```

## How the Pipeline Works

1. `lib/fetch/fetchPage.ts` attempts a fast HTML fetch first.
2. `lib/fetch/renderPage.ts` falls back to Playwright when the initial HTML is insufficient.
3. `lib/extract/extractMetrics.ts` composes the extractor modules for headings, links, images, CTAs, metadata, and content preview.
4. `lib/prompts/buildAuditPrompt.ts` converts the extracted metrics into a structured AI payload.
5. `lib/analyze/runAuditAnalysis.ts` calls Ollama and expects strict JSON.
6. `lib/logging/writePromptLog.ts` stores prompt traces in local development.
7. The UI renders four distinct sections:
   - factual metrics
   - AI insights
   - recommendations
   - AI trace

## Factual Grounding

Grounding is enforced in three ways:

- Factual metrics are produced only by deterministic extractors.
- The model prompt explicitly forbids inventing data.
- The AI output is validated against a strict Zod schema before rendering.

If something cannot be reliably extracted, the app returns `null`, empty arrays, or zero counts instead of guessing.

## Prompt Logging

Every local audit writes a JSON trace and a Markdown trace to `prompt-logs/`.

Each trace contains:

- timestamp
- audited URL
- system prompt
- user prompt
- exact structured input payload
- raw model output
- parsed model output

The same trace is also available in the UI inside the collapsible AI trace panel.

## Environment Variables

Create a local `.env` file from `.env.example`.

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
OLLAMA_API_KEY=
NEXT_PUBLIC_APP_NAME=Website Audit Tool
```

For cloud mode, use:

```env
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_MODEL=gpt-oss:120b
OLLAMA_API_KEY=your_real_ollama_cloud_key
NEXT_PUBLIC_APP_NAME=Website Audit Tool
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

Then edit `.env` with either local Ollama or Ollama cloud credentials.

### 3. Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Local Ollama Setup

If you want to run against local Ollama:

```bash
ollama serve
ollama pull llama3.1:8b
```

And use:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
OLLAMA_API_KEY=
```

## Cloud Ollama Setup

If you want to run against Ollama cloud:

```env
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_MODEL=gpt-oss:120b
OLLAMA_API_KEY=your_real_ollama_cloud_key
```

For cloud mode, the app sends:

```text
Authorization: Bearer <OLLAMA_API_KEY>
```

## Tests

Run:

```bash
npm run test
```

Current test coverage includes:

- heading extraction
- internal vs external link classification
- image alt coverage
- CTA heuristic behavior
- metadata extraction
- API route flow with mocked AI

## Docker

If evaluators want to run it with Docker:

```bash
docker compose up --build
```

## Trade-offs

- CTA detection is heuristic-based and not a perfect semantic classifier.
- Some JavaScript-heavy pages may need the Playwright fallback.
- Visible text extraction is approximate rather than full content-main detection.
- AI insight quality depends on the selected excerpt quality and model capability.
- This is intentionally a single-page evaluator, not a full-site crawler.
- Prompt logs are verbose by design because transparency matters for evaluation.

## Future Improvements

- rendered screenshots and multimodal visual analysis
- Lighthouse or PageSpeed integration
- stronger main-content detection
- richer title and SERP checks
- smarter CTA classification
- PDF export and shareable reports
- authentication and audit history
- comparative audits

## Example Output Shape

```json
{
  "success": true,
  "data": {
    "metrics": {},
    "insights": {},
    "trace": {},
    "fetchStrategy": "html"
  }
}
```
