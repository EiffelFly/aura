"use client";

import * as React from "react";

import { cn } from "@aura/ui";

export const OnboardingProgressionItem = ({
  isCurrent,
  isPassed,
}: {
  isCurrent: boolean;
  isPassed: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex-shrink-0 grow-0 rounded-full",
        isCurrent ? "h-2.5 w-2.5" : "h-2 w-2",
        isCurrent ? "bg-primary" : isPassed ? "bg-secondary" : "bg-border",
      )}
    />
  );
};

export const OnboardingProgressionRoot = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-6">
      {children}
    </div>
  );
};
