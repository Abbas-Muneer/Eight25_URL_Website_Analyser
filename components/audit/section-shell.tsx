"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function SectionShell({ eyebrow, title, description, children }: SectionShellProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{eyebrow}</p>
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
          <p className="max-w-2xl text-sm text-[#a0a0a0]">{description}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}
