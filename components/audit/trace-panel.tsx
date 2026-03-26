"use client";

import { Copy, FileJson } from "lucide-react";
import { useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PromptTrace } from "@/types/audit";

type TracePanelProps = {
  trace: PromptTrace;
};

const entries = [
  { key: "systemPrompt", label: "System prompt" },
  { key: "userPrompt", label: "User prompt" },
  { key: "structuredInput", label: "Structured input" },
  { key: "rawModelOutput", label: "Raw output" },
  { key: "parsedOutput", label: "Parsed output" }
] as const;

export function TracePanel({ trace }: TracePanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyValue(key: (typeof entries)[number]["key"]) {
    const value = trace[key];
    const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1200);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI trace</CardTitle>
        <CardDescription>Full prompt transparency, saved locally under prompt logs in development mode.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {entries.map(({ key, label }) => (
            <AccordionItem value={key} key={key} className="border-b border-white/10">
              <AccordionTrigger>{label}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#888888]">
                      <FileJson className="h-3.5 w-3.5" />
                      {label}
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => copyValue(key)}>
                      <Copy className="mr-2 h-3.5 w-3.5" />
                      {copied === key ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <ScrollArea className="h-[280px] rounded-[4px] border border-white/10 bg-black p-4">
                    <pre className="prose-copy text-xs leading-6 text-[#d7d7d7]">
                      {typeof trace[key] === "string" ? trace[key] : JSON.stringify(trace[key], null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
