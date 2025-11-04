"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-lg border bg-white/60 p-4 shadow-sm dark:bg-zinc-900", className)}>
      {children}
    </div>
  );
}

export default Card;
