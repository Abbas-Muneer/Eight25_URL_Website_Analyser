"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = ["Fetching page", "Extracting structure", "Generating AI insights", "Finalizing report"];

export function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    }, 1300);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Audit in progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const isDone = index < activeStep;
          const isActive = index === activeStep;
          return (
            <div
              key={step}
              className="flex items-center gap-4 rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                ) : isActive ? (
                  <LoaderCircle className="h-4 w-4 animate-spin text-accent" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-white/25" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{step}</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${step}-${isActive}-${isDone}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-muted-foreground"
                  >
                    {isDone ? "Completed" : isActive ? "Processing now" : "Queued"}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
