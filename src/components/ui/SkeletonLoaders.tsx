"use client";

import React from "react";

export function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 space-y-4 animate-pulse shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-muted/60 rounded-xl" />
        <div className="h-8 w-8 bg-muted/60 rounded-xl" />
      </div>
      <div className="h-7 w-48 bg-muted/80 rounded-xl" />
      <div className="h-3 w-full bg-muted/40 rounded-lg" />
      <div className="h-3 w-2/3 bg-muted/40 rounded-lg" />
      <div className="pt-2 flex justify-between">
        <div className="h-4 w-20 bg-muted/60 rounded-lg" />
        <div className="h-4 w-24 bg-muted/60 rounded-lg" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-border/60 bg-muted/30 flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-muted/70 rounded-2xl shrink-0" />
        <div className="space-y-1.5">
          <div className="h-4 w-40 bg-muted/80 rounded-lg" />
          <div className="h-3 w-56 bg-muted/50 rounded-lg" />
        </div>
      </div>
      <div className="h-8 w-24 bg-muted/60 rounded-xl shrink-0" />
    </div>
  );
}

export function ProfileDrawerSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-muted/80 rounded-3xl" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-muted/80 rounded-xl" />
          <div className="h-3 w-28 bg-muted/50 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="h-16 bg-muted/50 rounded-2xl" />
        <div className="h-16 bg-muted/50 rounded-2xl" />
        <div className="h-16 bg-muted/50 rounded-2xl" />
      </div>
      <div className="h-24 bg-muted/40 rounded-2xl" />
    </div>
  );
}
