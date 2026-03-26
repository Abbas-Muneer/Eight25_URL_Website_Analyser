"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UrlFormProps = {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error: string | null;
};

const sampleUrl = "https://www.eight25media.com";

export function UrlForm({ onSubmit, isLoading, error }: UrlFormProps) {
  const [url, setUrl] = useState(sampleUrl);

  return (
    <div className="space-y-4">
      <form
        className="flex flex-col gap-3 md:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(url);
        }}
      >
        <label className="sr-only" htmlFor="audit-url">
          Website URL
        </label>
        <Input
          id="audit-url"
          type="url"
          inputMode="url"
          placeholder="Enter a single webpage URL"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "audit-url-error" : undefined}
          className="h-14 flex-1 rounded-[4px] text-base text-white placeholder:text-[#888888]"
        />
        <Button type="submit" size="lg" className="h-14 min-w-[180px] rounded-[4px]" disabled={isLoading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Analyzing" : "Analyze page"}
        </Button>
      </form>
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <button
          type="button"
          className="rounded-[4px] border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-[#a0a0a0] transition hover:bg-white/10 hover:text-white"
          onClick={() => setUrl(sampleUrl)}
        >
          Use sample URL
        </button>
        <span>Single-page audit only. Factual metrics first, AI analysis second.</span>
      </div>
      {error ? (
        <p id="audit-url-error" className="text-sm text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
